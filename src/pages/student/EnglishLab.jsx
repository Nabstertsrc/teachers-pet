import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const GRADES = ['R','1','2','3','4','5','6','7','8','9','10','11','12']
const GRADE_COLORS = { R:'#f472b6','1':'#fb923c','2':'#facc15','3':'#a3e635','4':'#34d399','5':'#22d3ee','6':'#60a5fa','7':'#818cf8','8':'#a78bfa','9':'#c084fc','10':'#e879f9','11':'#f472b6','12':'#fb7185' }

import { db } from '../../lib/db'
import { generateLabContent } from '../../lib/gemini'
import { getAdaptivePlan, recordAdaptiveResult } from '../../lib/adaptivePlanner'

const GRAMMAR_Q = [
  { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 'goes', rule: 'Subject-Verb Agreement' },
  { sentence: 'The children ___ playing outside.', options: ['is', 'are', 'was', 'am'], answer: 'are', rule: 'Plural subjects take "are"' },
  { sentence: 'I have ___ my homework.', options: ['did', 'does', 'done', 'do'], answer: 'done', rule: 'Past participle with "have"' },
  { sentence: '___ you like some tea?', options: ['Will', 'Would', 'Can', 'Do'], answer: 'Would', rule: 'Polite requests use "would"' },
]

const WRITING_PROMPTS = [
  'Write about a day when everything went backwards.',
  'Describe your favorite place using all five senses.',
  'A letter to your future self, 10 years from now.',
  'The strangest animal you could imagine — describe it!',
  'Write a short story that begins with: "The door opened by itself..."',
]

const LESSON_PASSAGES = [
  {
    title: 'Inference',
    text: 'The hallway was wet, umbrellas dripped near the door, and everyone shook water from their jackets.',
    question: 'What can you infer about the weather?',
    answer: 'It is raining outside.',
    options: ['It is snowing outside.', 'It is raining outside.', 'It is windy but dry.', 'It is very hot outside.'],
    explain: 'Good readers combine clues (wet hallway + dripping umbrellas) to infer rain.'
  },
  {
    title: 'Author Purpose',
    text: 'Remember to wash your hands for 20 seconds before eating to reduce germs.',
    question: 'What is the author mainly trying to do?',
    answer: 'Inform and advise the reader.',
    options: ['Entertain with a story.', 'Inform and advise the reader.', 'Describe a fictional place.', 'Persuade to buy a product.'],
    explain: 'Instructional language ("remember to") signals informative/advisory purpose.'
  }
]

export default function EnglishLab() {
  const toast = useToast()
  const [grade, setGrade] = useState('5')
  const [tab, setTab] = useState('vocab')
  const [vocabIdx, setVocabIdx] = useState(0)
  const [vocabScore, setVocabScore] = useState(0)
  const [vocabFb, setVocabFb] = useState(null)
  const [gramIdx, setGramIdx] = useState(0)
  const [gramScore, setGramScore] = useState(0)
  const [gramFb, setGramFb] = useState(null)
  const [essay, setEssay] = useState('')
  const [promptIdx, setPromptIdx] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [vocabWords, setVocabWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [lessonIndex, setLessonIndex] = useState(0)
  const [lessonFeedback, setLessonFeedback] = useState('')
  const [vocabDone, setVocabDone] = useState(false)
  const [gramDone, setGramDone] = useState(false)
  const [planTick, setPlanTick] = useState(0)

  const gc = GRADE_COLORS[grade]
  const activeLesson = useMemo(() => LESSON_PASSAGES[lessonIndex % LESSON_PASSAGES.length], [lessonIndex])
  const adaptivePlan = useMemo(() => getAdaptivePlan('english', grade), [grade, planTick])

  useEffect(() => {
    async function loadVocab() {
      setLoading(true)
      try {
        const cached = await db.lab_content.where({ labType: 'english_vocab', grade }).first()
        if (cached && cached.content) {
          const deck = [...cached.content].slice(0, 12)
          setVocabWords(deck)
        } else {
          toast('Generating new Vocabulary words...', 'info')
          const words = await generateLabContent('english_vocab', grade)
          if (words && words.length > 0) {
            const deck = [...words].slice(0, 12)
            setVocabWords(deck)
            await db.lab_content.add({
              labType: 'english_vocab',
              grade,
              content: words,
              generatedAt: new Date().toISOString()
            })
          }
        }
      } catch (err) {
        console.error(err)
        toast('Failed to load vocabulary.', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadVocab()
  }, [grade, toast])

  const checkVocab = (ans) => {
    if (!vocabWords || vocabWords.length === 0 || vocabDone) return;
    const correct = ans === vocabWords[vocabIdx].meaning
    setVocabFb(correct ? 'correct' : 'wrong')
    if (correct) setVocabScore(s => s + 10)
    recordAdaptiveResult('english', grade, correct)
    setPlanTick((v) => v + 1)
    setTimeout(() => {
      setVocabFb(null)
      if (correct) {
        if (vocabIdx >= vocabWords.length - 1) {
          setVocabDone(true)
        } else {
          setVocabIdx(i => i + 1)
        }
      }
    }, 1200)
  }

  const checkGram = (ans) => {
    if (gramDone) return
    const correct = ans === GRAMMAR_Q[gramIdx].answer
    setGramFb(correct ? 'correct' : 'wrong')
    if (correct) setGramScore(s => s + 10)
    recordAdaptiveResult('english', grade, correct)
    setPlanTick((v) => v + 1)
    setTimeout(() => {
      setGramFb(null)
      if (correct) {
        if (gramIdx >= GRAMMAR_Q.length - 1) {
          setGramDone(true)
        } else {
          setGramIdx(i => i + 1)
        }
      }
    }, 1200)
  }

  const handleEssay = (text) => {
    setEssay(text)
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length)
  }

  return (
    <div className="lab-fullscreen">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>📝</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>English Lab</h2>
          <select value={grade} onChange={e => { setGrade(e.target.value); setVocabIdx(0) }} style={{ background: '#1f2937', color: '#fff', border: '1px solid #2a3040', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
        <div className="lab-tabs">
          <button className={`nav-btn ${tab === 'vocab' ? 'active' : ''}`} onClick={() => setTab('vocab')}>📚 Vocabulary</button>
          <button className={`nav-btn ${tab === 'grammar' ? 'active' : ''}`} onClick={() => setTab('grammar')}>✏️ Grammar</button>
          <button className={`nav-btn ${tab === 'lesson' ? 'active' : ''}`} onClick={() => setTab('lesson')}>🎬 Lesson Studio</button>
          <button className={`nav-btn ${tab === 'writing' ? 'active' : ''}`} onClick={() => setTab('writing')}>🖊️ Creative Writing</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
      </div>

      <div className="lab-main">
        <div className="adaptive-banner">
          Adaptive Plan: {adaptivePlan.level} | Mastery {adaptivePlan.mastery}% | {adaptivePlan.objective}
        </div>
        {tab === 'vocab' && (
          <div className="game-center">
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <div className="loading-text">Generating Dynamic Vocabulary...</div>
              </div>
            ) : vocabWords.length > 0 ? (
              <div className="game-card-lg">
                <div className="gc-top"><h3>📚 Word Power</h3><span className="pill">🍎 {vocabScore}</span></div>
                <motion.div key={vocabIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="vocab-display">
                  <div className="big-word" style={{ color: gc }}>{vocabWords[vocabIdx].word}</div>
                  <p style={{ opacity: 0.6, marginBottom: 30 }}>What does this word mean?</p>
                  <div className="opts-col">
                    {vocabWords[vocabIdx].options.map(o => (
                      <motion.button key={o} className="opt-btn" whileTap={{ scale: 0.96 }} onClick={() => !vocabFb && checkVocab(o)}>{o}</motion.button>
                    ))}
                  </div>
                </motion.div>
                {vocabFb === 'correct' && <div className="fb-bar correct">✅ Correct! +10🍎</div>}
                {vocabFb === 'wrong' && <div className="fb-bar wrong">❌ Try again!</div>}
                {vocabDone && <div className="fb-bar correct">🏁 Vocabulary round complete. No looping.</div>}
                {vocabDone && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setVocabIdx(0); setVocabDone(false); setVocabScore(0) }}
                  >
                    Restart Vocabulary Set
                  </button>
                )}
              </div>
            ) : (
              <div style={{ color: 'white' }}>Failed to load content.</div>
            )}
          </div>
        )}

        {tab === 'grammar' && (
          <div className="game-center">
            <div className="game-card-lg">
              <div className="gc-top"><h3>✏️ Grammar Fix</h3><span className="pill">🍎 {gramScore}</span></div>
              <motion.div key={gramIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <div className="sentence-display">{GRAMMAR_Q[gramIdx].sentence}</div>
                <div className="opts-row">
                  {GRAMMAR_Q[gramIdx].options.map(o => (
                    <motion.button key={o} className="opt-btn-sm" whileTap={{ scale: 0.95 }} onClick={() => !gramFb && checkGram(o)}>{o}</motion.button>
                  ))}
                </div>
              </motion.div>
              {gramFb === 'correct' && <div className="fb-bar correct">✅ Rule: {GRAMMAR_Q[gramIdx].rule}</div>}
              {gramFb === 'wrong' && <div className="fb-bar wrong">❌ Not quite. Think about the rule!</div>}
              {gramDone && <div className="fb-bar correct">🏁 Grammar set complete. No looping.</div>}
              {gramDone && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setGramIdx(0); setGramDone(false); setGramScore(0) }}>
                  Restart Grammar Set
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'writing' && (
          <div className="writing-layout">
            <div className="prompt-panel">
              <h3>🖊️ Writing Prompt</h3>
              <div className="prompt-card">{WRITING_PROMPTS[promptIdx]}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPromptIdx(i => (i + 1) % WRITING_PROMPTS.length)}>🎲 New Prompt</button>
              <div className="wc-display">{wordCount} words</div>
            </div>
            <div className="editor-area">
              <textarea className="writing-editor" placeholder="Start writing your masterpiece here..." value={essay} onChange={e => handleEssay(e.target.value)} />
            </div>
          </div>
        )}

        {tab === 'lesson' && (
          <div className="game-center" style={{ maxWidth: 900 }}>
            <div className="game-card-lg">
              <div className="gc-top"><h3>🎬 Reading & Language Studio</h3><span className="pill">Grade {grade}</span></div>
              <div className="lesson-grid">
                <div className="lesson-pane">
                  <svg viewBox="0 0 440 220" width="100%" height="220" role="img" aria-label="Reading fluency animation">
                    <rect x="0" y="0" width="440" height="220" fill="#0f172a" rx="12" />
                    <text x="18" y="28" fill="#f8fafc" fontSize="13">Fluency Pattern</text>
                    {[0,1,2,3,4,5].map((n) => (
                      <path
                        key={n}
                        d={`M 20 ${190 - n * 22} Q 70 ${120 - n * 18}, 120 ${190 - n * 22} T 220 ${190 - n * 22} T 320 ${190 - n * 22} T 420 ${190 - n * 22}`}
                        fill="none"
                        stroke={n % 2 === 0 ? '#38bdf8' : '#22c55e'}
                        strokeWidth="2"
                        opacity="0.85"
                      >
                        <animate attributeName="stroke-dasharray" values="0,600;600,0" dur={`${2 + n * 0.3}s`} repeatCount="indefinite" />
                      </path>
                    ))}
                  </svg>
                  <p style={{ marginTop: 10, fontSize: '0.9rem', opacity: 0.8 }}>
                    Read in phrases, not single words. Pause at punctuation and stress keywords to improve meaning.
                  </p>
                </div>
                <div className="lesson-pane">
                  <h4 style={{ marginTop: 0 }}>{activeLesson.title} Mini-Lesson</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{activeLesson.text}</p>
                  <p style={{ fontWeight: 700 }}>{activeLesson.question}</p>
                  <div className="opts-col">
                    {activeLesson.options.map((opt) => (
                      <button
                        key={opt}
                        className="opt-btn"
                        onClick={() => {
                          const correct = opt === activeLesson.answer
                          setLessonFeedback(correct ? `✅ ${activeLesson.explain}` : '❌ Try again. Use evidence from the sentence.')
                          recordAdaptiveResult('english', grade, correct)
                          setPlanTick((v) => v + 1)
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {lessonFeedback && <div className="fb-bar correct" style={{ marginTop: 10 }}>{lessonFeedback}</div>}
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => { setLessonIndex(i => i + 1); setLessonFeedback('') }}>
                    Next Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .lab-fullscreen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0e1a;color:#fff;z-index:2000;display:flex;flex-direction:column}
        .lab-hdr{padding:10px 24px;background:#111827;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937}
        .lab-tabs{display:flex;gap:8px}
        .nav-btn{background:none;border:none;color:#94a3b8;padding:8px 14px;cursor:pointer;font-weight:600;font-size:.85rem;transition:all .2s}
        .nav-btn.active{color:#38bdf8;border-bottom:2px solid #38bdf8}
        .lab-main{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center}
        .adaptive-banner{position:fixed;top:64px;left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid #334155;border-radius:999px;padding:6px 14px;font-size:0.82rem;z-index:4}
        .game-center{width:100%;max-width:600px;padding:20px}
        .game-card-lg{background:#1a1f2e;border:1px solid #2a3040;border-radius:24px;padding:40px}
        .gc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}
        .pill{background:#1f2937;padding:4px 14px;border-radius:12px;font-size:.85rem}
        .big-word{font-size:3rem;font-weight:900;color:#38bdf8;margin-bottom:10px}
        .opts-col{display:flex;flex-direction:column;gap:12px}
        .opts-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:25px}
        .opt-btn{background:#1f2937;border:2px solid #2a3040;color:#fff;padding:16px;border-radius:14px;font-size:1rem;cursor:pointer;transition:all .2s;text-align:left}
        .opt-btn:hover{border-color:#38bdf8}
        .opt-btn-sm{background:#1f2937;border:2px solid #2a3040;color:#fff;padding:12px 20px;border-radius:12px;font-size:1.1rem;font-weight:700;cursor:pointer;transition:all .2s}
        .opt-btn-sm:hover{border-color:#38bdf8}
        .sentence-display{font-size:1.8rem;font-weight:600;margin-bottom:10px;line-height:1.4}
        .fb-bar{margin-top:20px;padding:14px;border-radius:12px;font-weight:600}
        .fb-bar.correct{background:#2ecc7115;color:#2ecc71}
        .fb-bar.wrong{background:#e74c3c15;color:#e74c3c}
        .writing-layout{display:flex;width:100%;height:100%}
        .prompt-panel{width:300px;background:#111827;padding:25px;border-right:1px solid #1f2937;display:flex;flex-direction:column;gap:15px}
        .prompt-card{background:#1a1f2e;padding:20px;border-radius:16px;font-size:1.1rem;line-height:1.6;border-left:4px solid #38bdf8}
        .wc-display{margin-top:auto;font-size:2rem;font-weight:900;opacity:.3}
        .editor-area{flex:1;padding:30px}
        .writing-editor{width:100%;height:100%;background:#1a1f2e;border:1px solid #2a3040;color:#fff;padding:30px;border-radius:16px;font-size:1.1rem;line-height:1.8;resize:none;font-family:Georgia,serif}
        .writing-editor:focus{outline:none;border-color:#38bdf8}
        .lesson-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .lesson-pane{background:#111827;border:1px solid #2a3040;border-radius:14px;padding:14px}
        @media (max-width: 900px){.lesson-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  )
}
