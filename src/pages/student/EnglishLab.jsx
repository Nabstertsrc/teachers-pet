import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const GRADES = ['R','1','2','3','4','5','6','7','8','9','10','11','12']
const GRADE_COLORS = { R:'#f472b6','1':'#fb923c','2':'#facc15','3':'#a3e635','4':'#34d399','5':'#22d3ee','6':'#60a5fa','7':'#818cf8','8':'#a78bfa','9':'#c084fc','10':'#e879f9','11':'#f472b6','12':'#fb7185' }

const VOCAB_BY_LEVEL = {
  foundation: [
    { word: 'Happy', meaning: 'Feeling good or joyful', options: ['Sad', 'Feeling good or joyful', 'Angry', 'Tired'] },
    { word: 'Big', meaning: 'Large in size', options: ['Small', 'Large in size', 'Fast', 'Quiet'] },
    { word: 'Kind', meaning: 'Nice and caring', options: ['Mean', 'Nice and caring', 'Loud', 'Slow'] },
  ],
  intermediate: [
    { word: 'Curious', meaning: 'Eager to learn or know', options: ['Bored', 'Eager to learn or know', 'Frightened', 'Lazy'] },
    { word: 'Generous', meaning: 'Willing to give and share', options: ['Selfish', 'Willing to give and share', 'Shy', 'Angry'] },
    { word: 'Ancient', meaning: 'Very old, from long ago', options: ['New', 'Very old, from long ago', 'Small', 'Bright'] },
  ],
  senior: [
    { word: 'Ephemeral', meaning: 'Lasting for a very short time', options: ['Permanent', 'Lasting for a very short time', 'Very large', 'Extremely loud'] },
    { word: 'Resilient', meaning: 'Able to recover quickly', options: ['Fragile', 'Dangerous', 'Able to recover quickly', 'Very slow'] },
    { word: 'Eloquent', meaning: 'Fluent and persuasive in speech', options: ['Silent', 'Fluent and persuasive in speech', 'Confusing', 'Angry'] },
  ],
  fet: [
    { word: 'Ubiquitous', meaning: 'Found everywhere', options: ['Rare', 'Found everywhere', 'Mysterious', 'Ancient'] },
    { word: 'Meticulous', meaning: 'Showing great attention to detail', options: ['Careless', 'Showing great attention to detail', 'Very fast', 'Extremely lazy'] },
    { word: 'Pragmatic', meaning: 'Dealing with things in a practical way', options: ['Idealistic', 'Dealing with things in a practical way', 'Emotional', 'Reckless'] },
  ],
}

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

  const g = grade === 'R' ? 0 : parseInt(grade)
  const band = g <= 3 ? 'foundation' : g <= 6 ? 'intermediate' : g <= 9 ? 'senior' : 'fet'
  const VOCAB_WORDS = VOCAB_BY_LEVEL[band]
  const gc = GRADE_COLORS[grade]

  const checkVocab = (ans) => {
    const correct = ans === VOCAB_WORDS[vocabIdx].meaning
    setVocabFb(correct ? 'correct' : 'wrong')
    if (correct) setVocabScore(s => s + 10)
    setTimeout(() => {
      setVocabFb(null)
      if (correct) setVocabIdx(i => (i + 1) % VOCAB_WORDS.length)
    }, 1200)
  }

  const checkGram = (ans) => {
    const correct = ans === GRAMMAR_Q[gramIdx].answer
    setGramFb(correct ? 'correct' : 'wrong')
    if (correct) setGramScore(s => s + 10)
    setTimeout(() => {
      setGramFb(null)
      if (correct) setGramIdx(i => (i + 1) % GRAMMAR_Q.length)
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
          <button className={`nav-btn ${tab === 'writing' ? 'active' : ''}`} onClick={() => setTab('writing')}>🖊️ Creative Writing</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
      </div>

      <div className="lab-main">
        {tab === 'vocab' && (
          <div className="game-center">
            <div className="game-card-lg">
              <div className="gc-top"><h3>📚 Word Power</h3><span className="pill">🍎 {vocabScore}</span></div>
              <motion.div key={vocabIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="vocab-display">
                <div className="big-word" style={{ color: gc }}>{VOCAB_WORDS[vocabIdx % VOCAB_WORDS.length].word}</div>
                <p style={{ opacity: 0.6, marginBottom: 30 }}>What does this word mean?</p>
                <div className="opts-col">
                  {VOCAB_WORDS[vocabIdx].options.map(o => (
                    <motion.button key={o} className="opt-btn" whileTap={{ scale: 0.96 }} onClick={() => !vocabFb && checkVocab(o)}>{o}</motion.button>
                  ))}
                </div>
              </motion.div>
              {vocabFb === 'correct' && <div className="fb-bar correct">✅ Correct! +10🍎</div>}
              {vocabFb === 'wrong' && <div className="fb-bar wrong">❌ Try again!</div>}
            </div>
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
      </div>
      <style>{`
        .lab-fullscreen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0e1a;color:#fff;z-index:2000;display:flex;flex-direction:column}
        .lab-hdr{padding:10px 24px;background:#111827;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937}
        .lab-tabs{display:flex;gap:8px}
        .nav-btn{background:none;border:none;color:#94a3b8;padding:8px 14px;cursor:pointer;font-weight:600;font-size:.85rem;transition:all .2s}
        .nav-btn.active{color:#38bdf8;border-bottom:2px solid #38bdf8}
        .lab-main{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center}
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
      `}</style>
    </div>
  )
}
