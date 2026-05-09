import { GoogleGenerativeAI } from '@google/generative-ai'

const getSettings = () => {
  try {
    const s = localStorage.getItem('tp_settings')
    return s ? JSON.parse(s) : {}
  } catch { return {} }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))
const stripCodeFences = (value = '') => value.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim()

function parseFirstJsonBlock(raw, fallback = null) {
  try {
    const clean = stripCodeFences(raw)
    return JSON.parse(clean)
  } catch {
    try {
      const objMatch = raw.match(/\{[\s\S]*\}/)
      if (objMatch) return JSON.parse(objMatch[0])
      const arrMatch = raw.match(/\[[\s\S]*\]/)
      if (arrMatch) return JSON.parse(arrMatch[0])
      return fallback
    } catch {
      return fallback
    }
  }
}

function simpleMathFallback(problem, grade) {
  const sanitized = String(problem || '').replace(/[^\d+\-*/().=xX\s]/g, '').trim()
  const linear = sanitized.match(/^([+-]?\d*)\s*[xX]\s*([+-]\s*\d+)?\s*=\s*([+-]?\d+)$/)
  if (linear) {
    const aRaw = linear[1].replace(/\s+/g, '')
    const bRaw = (linear[2] || '0').replace(/\s+/g, '')
    const c = Number(linear[3])
    const a = aRaw === '' || aRaw === '+' ? 1 : aRaw === '-' ? -1 : Number(aRaw)
    const b = Number(bRaw || 0)
    if (!Number.isNaN(a) && !Number.isNaN(b) && !Number.isNaN(c) && a !== 0) {
      const x = (c - b) / a
      return `## Offline Maths Solver (Fallback)\n\nGiven: \\(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}\\)\n\n1. Move constant to the right: \\(${a}x = ${c - b}\\)\n2. Divide by \\(${a}\\): \\(x = ${x}\\)\n\nFinal answer: **x = ${x}**\n\n_Grade ${grade} explanation generated in offline fallback mode._`
    }
  }
  try {
    // Controlled arithmetic fallback; only arithmetic symbols are allowed.
    if (/^[\d+\-*/().\s]+$/.test(sanitized)) {
      const result = Function(`"use strict"; return (${sanitized})`)()
      if (typeof result === 'number' && Number.isFinite(result)) {
        return `## Offline Maths Solver (Fallback)\n\nExpression: \\(${sanitized}\\)\n\nResult: **${result}**\n\n_No AI provider available, so this was solved locally._`
      }
    }
  } catch {
    // Ignore and return generic fallback.
  }
  return `## Maths Helper (Fallback)\n\nI could not reach the AI provider right now. Please verify your API key/network in **Settings**, then retry.\n\nProblem submitted:\n\n> ${problem}`
}

function tutorialFallback(topic, grade) {
  return `## ${topic} - Grade ${grade} (Fallback Lesson)\n\n### 1. Quick Concept\n- Understand the core definition of **${topic}**.\n- Identify where it appears in real problems.\n\n### 2. Worked Structure\n1. Read the question carefully.\n2. Identify known values.\n3. Choose the correct formula/rule.\n4. Substitute and simplify.\n5. Check if answer is reasonable.\n\n### 3. Practice\n- Example A: Basic recall question\n- Example B: Multi-step application\n- Example C: Word problem translation\n\n### 4. Pro Tip\n- Keep an error log: write each mistake and its correction pattern.\n\n_This lesson is shown because AI service is currently unavailable._`
}

async function generate(prompt, systemInstruction = '', retries = 3) {
  // Guard against internet disconnection
  if (typeof window !== "undefined" && !navigator.onLine) {
    throw new Error("No internet connection detected. Please check your network.");
  }

  const settings = getSettings()
  const geminiKey = settings.geminiKey || import.meta.env.VITE_GEMINI_API_KEY
  const deepseekKey = settings.deepseekKey || import.meta.env.VITE_DEEPSEEK_API_KEY

  const tryGemini = async (modelName) => {
    if (!geminiKey) throw new Error('No Gemini API key')
    const genAI = new GoogleGenerativeAI(geminiKey)
    // Try forcing v1 if v1beta fails? SDK doesn't expose it easily, but we can try different model strings
    const model = genAI.getGenerativeModel({ model: modelName, ...(systemInstruction && { systemInstruction }) })
    const result = await model.generateContent(prompt)
    return result.response.text()
  }

  const tryDeepSeek = async () => {
    if (!deepseekKey) throw new Error('No DeepSeek API key')
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${deepseekKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: prompt }]
      })
    })
    if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`)
    const data = await response.json()
    return data.choices[0].message.content
  }

  for (let i = 0; i < retries; i++) {
    try {
      if (geminiKey) {
        // Try these models in order, prioritizing Gemini 3
        const modelsToTry = [
          'gemini-2.5-flash',
          'gemini-2.5-flash-lite',
          'gemini-2.0-flash', 
          'gemini-1.5-flash', 
          'gemini-1.5-flash-latest'
        ]
        let lastErr = null
        
        for (const mName of modelsToTry) {
          try {
            return await tryGemini(mName)
          } catch (e) {
            lastErr = e
            if (e.message?.includes('404')) {
              console.warn(`Gemini model ${mName} not found, trying next...`)
              continue
            }
            break // If it's not a 404 (e.g. 429), don't try other models, just retry loop
          }
        }
        
        console.warn('All Gemini models failed, falling back to DeepSeek...', lastErr?.message)
        if (deepseekKey) return await tryDeepSeek()
        throw lastErr
      }

      if (deepseekKey) return await tryDeepSeek()
      throw new Error('No AI API keys provided')
    } catch (e) {
      const msg = e.message?.toLowerCase() || ''
      const isNetworkError = msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('internet')
      if (isNetworkError) throw new Error('Network error: Please check your internet connection and try again.')

      const isRetryable = msg.includes('429') || msg.includes('500') || msg.includes('503')
      if (isRetryable && i < retries - 1) {
        await delay(2000 * (i + 1))
        continue
      }
      throw e
    }
  }
}

export async function generateLesson({ subject, grade, topic, duration, objectives, language = 'English', style = 'formal', extraDetails = '' }) {
  const sys = `You are a high-level educational consultant and curriculum designer. 
Your goal is to create PRE-PRINT READY, professional lesson plans.
STRICT FORMATTING RULES:
1. Use clear, bold Markdown headings (H1, H2, H3).
2. Use professional tables for timings and activities.
3. Use bullet points for objectives and resources.
4. INTEGRATE VISUALS: If a concept is complex (e.g., Water Cycle, Digestive System, Logic Gates, Market Equilibrium), you MUST include a \`\`\`mermaid code block to visualize it.
5. Tone: Academic, encouraging, and highly structured.`
  const prompt = `Create a complete lesson plan with the following details:
- Subject: ${subject}
- Grade/Level: ${grade}
- Topic: ${topic}
- Duration: ${duration} minutes
- Learning Objectives: ${objectives}
- Language of instruction: ${language}
- Teaching style: ${style}
${extraDetails ? `- Additional details: ${extraDetails}` : ''}

Include these sections:
## 1. Lesson Overview
## 2. Prior Knowledge Required
## 3. Resources & Materials
## 4. Introduction / Hook (with timing)
## 5. Main Body / Development (with timing and teacher/learner activities)
## 6. Guided Practice / Activities
## 7. Assessment & Differentiation
## 8. Conclusion & Reflection
## 9. Homework / Extension Tasks
## 10. Reflection Notes (for teacher to complete after lesson)`
  return generate(prompt, sys)
}

export async function generateAnnualPlan({ subject, grade, terms, weeksPerTerm, curriculum = 'CAPS' }) {
  const isSA = curriculum.includes('CAPS') || curriculum.includes('South Africa')
  const sys = `You are a curriculum specialist designing professional Annual Teaching Plans (ATPs).
FORMATTING:
1. Use H1 for the Subject and Grade.
2. Use large Markdown tables for the breakdown.
3. Use high-contrast formatting (Bold keys, clear separators).
4. Tone: Official, compliant, and organized.`
  
  const structure = isSA 
    ? "Columns: WEEK | LISTENING AND SPEAKING | READING AND VIEWING | WRITING AND PRESENTING | LANGUAGE STRUCTURES AND CONVENTIONS"
    : "Columns: WEEK | TOPIC | SUBTOPICS | ASSESSMENT"

  const prompt = `Create a complete Annual Teaching Plan for:
- Subject: ${subject}
- Grade: ${grade}
- Curriculum: ${curriculum}
- Terms: ${terms}

Format Requirements:
1. Use Markdown tables for each term.
2. ${structure}
3. Group weeks in pairs (e.g., 1-2, 3-4) to match official ATP pacing.
4. Include detailed bullet points for activities and sub-skills in each cell.
5. Add a "Resources Required" section after each term table.`

  return generate(prompt, sys)
}

export async function generateQuestions({ subject, grade, topic, totalMarks, sections, difficulty, includeAnswers }) {
  const sys = `You are a senior assessment specialist and examiner. 
Your goal is to create a PROFESSIONAL EXAM PAPER that looks official and is ready for duplication.
STRICT FORMATTING:
1. Header: School Name, Subject, Grade, Total Marks, Time.
2. Instructions: Clear, numbered instructions for the student.
3. Questions: Use proper numbering (e.g., 1.1, 1.2). Include mark allocations in brackets like [5] or (2).
4. VISUALS: For at least one section, include a "Source-Based" question. Refer to a diagram: "Question 2: Refer to the diagram of the [Topic] below and answer the questions that follow."
5. DIAGRAMS: You MUST provide the diagram using \`\`\`mermaid syntax if the subject allows (Science, Math, Tech, Geo, etc.).
6. Page layout: Use clear separation between sections.`
  
  const prompt = `Create a ${subject} question paper for Grade ${grade} on the topic: "${topic}"
- Total marks: ${totalMarks}
- Difficulty: ${difficulty}
- Sections: ${sections}
- Include memorandum: ${includeAnswers ? 'Yes' : 'No'}

Structure:
- Professional Header (School, Subject, Grade, Date, Time, Marks)
- Clear Sections (A, B, C etc.)
- Use various question types: MCQ, Short Answer, Long Answer, Paragraph.
- Mark allocations like [5] or [2+2=4]
- Diagrams: Use \`\`\`mermaid blocks for visual aids (e.g., flowcharts, cycles, or simple structures).
${includeAnswers ? '- Detailed Memorandum at the end' : ''}`
  
  return generate(prompt, sys)
}

export async function generateStudyGuide({ subject, grade, topic, lessonContent = '' }) {
  const sys = `You are a student-friendly tutor creating engaging, easy-to-understand study guides. Use emojis, examples, and simple language.`
  const prompt = `Create a comprehensive study guide for:
- Subject: ${subject}  - Grade: ${grade}
- Topic: ${topic}
${lessonContent ? `Based on this content:\n${lessonContent.slice(0, 1000)}` : ''}

Include: Key concepts, definitions, worked examples, memory tips, quick quiz (5 questions with answers), summary checklist.`
  return generate(prompt, sys)
}

export async function generateFlashcards({ subject, grade, topic, count = 10 }) {
  const sys = `You create concise, effective flashcards for students. Return ONLY valid JSON array.`
  const prompt = `Create ${count} flashcards for ${subject} Grade ${grade}, topic: "${topic}".
Return ONLY a JSON array: [{"front": "question/term", "back": "answer/definition"}, ...]`
  const raw = await generate(prompt, sys)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return JSON.parse(match ? match[0] : raw)
  } catch {
    return []
  }
}

export async function chatWithAI(messages, context = '') {
  const sys = `You are Teacher's Pet AI, a helpful assistant for teachers and students. ${context}`
  const history = messages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
  const last = messages[messages.length - 1]
  return generate(`${history}\n\nUser: ${last.content}\nAssistant:`, sys)
}

export async function generateMotivationalQuote() {
  return generate('Give ONE short, inspiring quote for teachers. Just the quote and author, nothing else. Format: "Quote" — Author')
}

export async function suggestResources({ subject, grade, topic }) {
  const prompt = `Suggest 5 educational resources (websites, videos, books) for teaching ${subject} Grade ${grade}, topic: "${topic}". Format as JSON array: [{"title":"","type":"website|video|book","url":"","description":""}]`
  const raw = await generate(prompt)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return JSON.parse(match ? match[0] : raw)
  } catch {
    return []
  }
}

export async function generateRubric({ subject, grade, taskDescription, criteriaCount = 4, levelCount = 4 }) {
  const sys = "You are a curriculum expert creating detailed marking rubrics."
  const prompt = `Create a marking rubric for a ${subject} task for Grade ${grade}.
Task: ${taskDescription}
Levels: ${levelCount} levels (e.g. 1-4)
Criteria: ${criteriaCount} distinct criteria
Format: Return as a Markdown table with levels as columns and criteria as rows. Include specific descriptors for each cell.`
  return generate(prompt, sys)
}

export async function generateReportComment({ studentName, subject, performance, personality, length = 'medium' }) {
  const sys = "You are a professional teacher writing constructive, balanced student report comments."
  const prompt = `Write a ${length} report comment for ${studentName} in ${subject}.
Performance: ${performance}
Personality/Behavior: ${personality}
Ensure it is professional, highlights strengths, and gives 1 area for improvement. Avoid clichés.`
  return generate(prompt, sys)
}

export async function generateParentEmail({ type, studentName, subject, details }) {
  const sys = "You are a professional teacher writing a helpful email to a parent."
  const prompt = `Write a ${type} email for a student named ${studentName} regarding ${subject}. 
Additional details: ${details}
Make it professional, supportive, and clear. Include a subject line.`
  return generate(prompt, sys)
}

/**
 * Unified Teaching Assistant Commands
 */

export async function generateReflection(content) {
  const sys = `You are an expert in Teacher Education and IPT (Initial Professional Training) Portfolios for UNISA.
Your goal is to help a student teacher reflect on their day.
If the input is a messy voice transcript, clean it up and structure it.
If no content is provided, provide the standard UNISA IPT Portfolio reflective prompts:
1. What was the focus of today's lesson?
2. What went well?
3. What challenges arose (learner behavior, timing, resources)?
4. How did you handle those challenges?
5. What will you do differently next time?
6. How does this connect to teaching theory?

FORMAT: Professional, structured, and ready for a portfolio.`
  
  const prompt = content 
    ? `Turn this transcript/note into a professional IPT Portfolio reflection: \n\n${content}`
    : `Please provide the standard IPT Portfolio reflective prompts to help me write my reflection.`
    
  return generate(prompt, sys)
}

export async function checkAcademicTone(text) {
  const sys = `You are an academic writing coach specialized in UNISA Harvard referencing and professional academic tone.
STRICT RULES for UNISA Harvard:
- In-text: (Author Year:Page) e.g., (Smith 2023:45).
- Reference List: Author, Initials. Year. Title in italics. Place: Publisher.
- Tone: No contractions (don't -> do not), no first person (I think -> It is argued), formal and objective.

TASKS:
1. Analyze the text for tone and suggest improvements.
2. Check any citations against UNISA Harvard style.
3. Provide a 'Corrected Version' of the text.`

  const prompt = `Analyze and improve the following text for my assignment:\n\n${text}`
  return generate(prompt, sys)
}

export async function generateClassroomIdeas(topic) {
  const sys = `You are a creative classroom activity generator.
Your goal is to provide 5 HIGHLY ENGAGING, out-of-the-box activities for a given topic.
For each activity, include:
- Name of Activity
- Brief Description
- Materials Needed
- Why it works (Pedagogical value)`

  const prompt = `Generate 5 creative classroom activities for the topic: ${topic}`
  return generate(prompt, sys)
}
export async function generateQuiz({ subject, topic, difficulty, count = 5 }) {
  const sys = `You are a quiz master. Create a multiple-choice quiz. Return ONLY valid JSON array.`
  const prompt = `Create a ${count} question quiz on ${subject}: ${topic} at ${difficulty} level.
  Return ONLY a JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "index of correct option (0-3)", "explanation": "..."}]`
  const raw = await generate(prompt, sys)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return JSON.parse(match ? match[0] : raw)
  } catch { return [] }
}

export async function summarizeNotes(content) {
  const sys = `You are an expert at summarizing long educational content into structured, concise notes.`
  const prompt = `Please summarize the following content into a structured format with:
  1. Executive Summary
  2. Key Concepts (Bullet points)
  3. Simplified Explanation (For complex parts)
  4. 3 Revision Questions
  
  Content:\n${content.slice(0, 15000)}`
  return generate(prompt, sys)
}

export async function deepDiveConcept(concept) {
  const sys = `You are a specialist in explaining complex concepts using the Feynman Technique (simply and clearly).`
  const prompt = `Provide a "Deep Dive" into the concept: "${concept}".
  Use analogies, clear examples, and avoid overly technical jargon where possible. Explain it like I'm 12.`
  return generate(prompt, sys)
}

export async function analyzeDocument(content) {
  const sys = `You are an academic organizer. Extract metadata from the provided content.`
  const prompt = `Analyze this document content and return ONLY a JSON object:
  {
    "subject": "e.g. Mathematics",
    "moduleCode": "e.g. MAT1511",
    "topics": ["topic1", "topic2"],
    "isAssignment": true/false,
    "dueDate": "YYYY-MM-DD (if found)",
    "summary": "Short 1-sentence summary"
  }
  
  Content:\n${content.slice(0, 10000)}`
  const raw = await generate(prompt, sys)
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    return JSON.parse(match ? match[0] : raw)
  } catch { return null }
}

export async function searchOpportunities(query) {
  const sys = `You are a Career & Study Opportunity Scout for South African students and teachers. 
  CURRENT DATE: May 2026. 
  Provide the latest real-world 2026/2027 opportunities based on your knowledge. 
  Include: Title, Source, Deadline (if known), and a direct Official Link.
  Format as a JSON array of objects.`
  const prompt = `Find the latest ${query} in South Africa for the 2026/2027 cycle. Return ONLY JSON array.`
  const raw = await generate(prompt, sys)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return JSON.parse(match ? match[0] : raw)
  } catch { return [] }
}

export async function generateInterventionStrategy({ studentName, grade, subject, issue, context }) {
  const prompt = `You are an expert Educational Psychologist and Master Teacher. 
  Create a tailored Learner Intervention Strategy for:
  Student: ${studentName}
  Grade: ${grade}
  Subject: ${subject}
  Primary Issue: ${issue}
  Additional Context: ${context}

  Provide:
  1. Root cause analysis (potential reasons).
  2. Immediate classroom strategies (for the teacher).
  3. Home support suggestions (for parents).
  4. SMART goals for improvement.
  5. Recommended resources or tools.

  Format the output in professional Markdown.`
  return generate(prompt)
}

export async function generateResume(data) {
  const sys = `You are a professional CV writer and career coach. 
  Create a modern, impact-driven resume that is ATS-friendly.
  If mode is 'extract', return ONLY a JSON object of the details found.
  Otherwise, return a beautiful Markdown-formatted Resume.`
  
  if (data.mode === 'extract') {
    const prompt = `Extract info from this text into JSON (name, email, phone, linkedIn, education, experience, skills): \n\n${data.scanContent}`
    const res = await generate(prompt, sys)
    const match = res.match(/\{[\s\S]*\}/)
    return match ? match[0] : res
  }

  if (data.mode === 'bio') {
    const prompt = `Create a professional LinkedIn Headline, 'About' section, and a short Professional Bio for:
    Name: ${data.name}
    Role: ${data.targetRole}
    Experience: ${data.experience}
    Skills: ${data.skills}
    
    Format for maximum impact and keywords.`
    return generate(prompt, sys)
  }

  const prompt = `Create a professional resume for:
  Name: ${data.name}
  Contact: ${data.email}, ${data.phone}, ${data.linkedIn}
  Target Role: ${data.targetRole}
  Experience: ${data.experience}
  Education: ${data.education}
  Skills: ${data.skills}
  ${data.additionalInfo ? `Additional Info: ${data.additionalInfo}` : ''}
  
  Structure it with clear headings, bullet points, and a summary section.`
  return generate(prompt, sys)
}

export async function solveMathProblem(problem, grade) {
  const sys = `You are an expert Math Tutor. Solve the problem step-by-step. 
  Explain the logic behind each step clearly. 
  Use LaTeX formatting for all mathematical expressions (e.g. $x^2 + y^2 = r^2$).
  Tailor the explanation for Grade ${grade}.`
  
  const prompt = `Solve and explain this math problem: ${problem}`
  try {
    return await generate(prompt, sys)
  } catch {
    return simpleMathFallback(problem, grade)
  }
}

export async function generateMathTutorial(topic, grade) {
  const sys = `You are a creative Math Teacher. Create an interactive-style tutorial for Grade ${grade}.
  Include: 
  1. A 'Catchy' Introduction
  2. Key Concepts
  3. 3 Practice Examples with solutions
  4. A 'Pro-Tip' for mastering this topic.
  Use LaTeX for formulas.`
  
  const prompt = `Create a tutorial for Grade ${grade} on the topic: ${topic}`
  try {
    return await generate(prompt, sys)
  } catch {
    return tutorialFallback(topic, grade)
  }
}

export async function predictReaction(el1, el2) {
  const sys = `You are a Virtual Science Lab assistant. 
  When given two elements or substances, predict their chemical reaction.
  If they react, provide: 1. Title of reaction, 2. Short description, 3. Visual effect (explosion, bubbles, color_change, or none).
  If they don't react, say 'No significant reaction'.
  Keep it educational and safe.`
  
  const prompt = `What happens when you mix ${el1} and ${el2}?`
  try {
    return await generate(prompt, sys)
  } catch {
    const key = [el1, el2].map((v) => String(v).toLowerCase()).sort().join('+')
    const offline = {
      'hydrogen+oxygen': 'Hydrogen Combustion\nHydrogen and oxygen can react to form water. Visual effect: none',
      'sodium+chlorine': 'Salt Formation\nSodium reacts strongly with chlorine to form sodium chloride. Visual effect: explosion',
      'iron+oxygen': 'Oxidation\nIron slowly reacts with oxygen to form rust over time. Visual effect: color_change',
    }
    return offline[key] || `No significant reaction\nNo curated offline reaction for ${el1} and ${el2}.`
  }
}

export async function generatePhonicsLesson(level) {
  const sys = `You are a Reading Specialist. Create a Phonics lesson for Level ${level}.
  Include: 1. A core sound/phoneme, 2. A list of 5 simple words with that sound, 3. A short practice sentence.`
  const prompt = `Generate a level ${level} phonics lesson.`
  return generate(prompt, sys)
}

export async function generateStory(topic, level) {
  const sys = `You are a Children's Book Author. Write a very short, engaging story (100 words max) for Reading Level ${level}.
  Focus on the topic: ${topic}. Use simple language.`
  const prompt = `Write a level ${level} story about ${topic}.`
  return generate(prompt, sys)
}

export async function generateCoverLetter(data) {
  const sys = `You are a professional career coach writing persuasive, tailored cover letters.`
  const prompt = `Write a cover letter for:
  Name: ${data.name}
  Target Role: ${data.targetRole}
  Target Company/School: ${data.targetCompany}
  Key Experience: ${data.experience}
  Key Skills: ${data.skills}
  
  Make it professional, enthusiastic, and focused on how the candidate can add value to ${data.targetCompany}.`
  return generate(prompt, sys)
}

export async function generateLabContent(labType, grade) {
  const sys = `You are a curriculum developer for the South African CAPS syllabus. 
  Generate 10 interactive lesson items for the specified lab type and grade.
  Output MUST be a raw JSON array of objects. No markdown formatting, no \`\`\`json wrappers. Just the raw array starting with [ and ending with ].`
  
  let prompt = ''
  if (labType === 'history_timeline') {
    prompt = `Generate a JSON array of 10 historical events for Grade ${grade} CAPS History. Format: [{"id": "1", "year": 1918, "event": "Event description"}]. Make sure the events are chronologically distinct and randomly ordered in the output so the student has to sort them.`
  } else if (labType === 'english_vocab') {
    prompt = `Generate a JSON array of 10 vocabulary words for Grade ${grade} CAPS English. Format: [{"word": "Ephemeral", "meaning": "Lasting for a very short time", "options": ["Permanent", "Lasting for a very short time", "Very large", "Extremely loud"]}]. Include one correct meaning and 3 plausible but incorrect options.`
  } else if (labType === 'natural_science') {
    prompt = `Generate a JSON array of 10 multiple choice questions for Grade ${grade} CAPS Natural Sciences. Format: [{"q": "Question text", "a": "Correct Answer", "options": ["Correct Answer", "Wrong 1", "Wrong 2"]}].`
  } else {
    prompt = `Generate a JSON array of 10 items for ${labType} for Grade ${grade}.`
  }

  let result = ''
  try {
    result = await generate(prompt, sys)
  } catch {
    if (labType === 'history_timeline') {
      return [
        { id: '1', year: 1910, event: 'Union of South Africa is established.' },
        { id: '2', year: 1948, event: 'Apartheid policy becomes official.' },
        { id: '3', year: 1960, event: 'Sharpeville protest and international response.' },
        { id: '4', year: 1976, event: 'Soweto student uprising.' },
        { id: '5', year: 1990, event: 'Nelson Mandela is released from prison.' },
        { id: '6', year: 1994, event: 'First democratic elections in South Africa.' },
      ].sort(() => Math.random() - 0.5)
    }
    if (labType === 'english_vocab') {
      return [
        { word: 'Analyze', meaning: 'To examine in detail', options: ['To examine in detail', 'To run fast', 'To cook food', 'To sing loudly'] },
        { word: 'Interpret', meaning: 'To explain the meaning of something', options: ['To build a wall', 'To explain the meaning of something', 'To erase text', 'To measure distance'] },
        { word: 'Evidence', meaning: 'Facts that support a claim', options: ['A random guess', 'Facts that support a claim', 'A weather forecast', 'A drawing style'] },
        { word: 'Compare', meaning: 'To identify similarities and differences', options: ['To identify similarities and differences', 'To hide details', 'To sell products', 'To sleep deeply'] },
      ]
    }
    if (labType === 'natural_science') {
      return [
        { q: 'What process do plants use to make food?', a: 'Photosynthesis', options: ['Photosynthesis', 'Condensation', 'Erosion', 'Filtration'] },
        { q: 'Which state of matter has a fixed volume but no fixed shape?', a: 'Liquid', options: ['Liquid', 'Gas', 'Plasma', 'Sound'] },
        { q: 'What force pulls objects toward Earth?', a: 'Gravity', options: ['Gravity', 'Magnetism', 'Friction', 'Evaporation'] },
      ]
    }
    return []
  }
  try {
    const parsed = parseFirstJsonBlock(result, [])
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to parse AI lab content:', e, result)
    return []
  }
}
