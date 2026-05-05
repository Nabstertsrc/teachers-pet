import { GoogleGenerativeAI } from '@google/generative-ai'

const getSettings = () => {
  try {
    const s = localStorage.getItem('tp_settings')
    return s ? JSON.parse(s) : {}
  } catch { return {} }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))

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
          'gemini-3-flash-preview', 
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
