import { useState, useRef } from 'react'
import { useToast } from '../../context/AppContext'
import { generateStudyGuide, generateQuiz, summarizeNotes, deepDiveConcept, chatWithAI } from '../../lib/gemini'
import { isPDF, extractTextFromPDF } from '../../lib/pdfProcessor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function StudyLab() {
  const toast = useToast()
  const [tab, setTab] = useState('guide')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  
  // States for different tools
  const [quiz, setQuiz] = useState(null)
  const [chat, setChat] = useState([])
  const [docContent, setDocContent] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    try {
      const text = await extractTextFromPDF(file)
      setDocContent(text)
      toast('Document loaded! 📄', 'success')
      setTab('docchat')
    } catch {
      toast('Failed to read document', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (type, data) => {
    setLoading(true)
    setResult('')
    try {
      let res;
      if (type === 'guide') res = await generateStudyGuide(data)
      if (type === 'summarize') res = await summarizeNotes(docContent || data)
      if (type === 'quiz') {
        const q = await generateQuiz(data)
        setQuiz(q)
        setTab('quiz-view')
        return
      }
      if (type === 'deepdive') res = await deepDiveConcept(data)
      
      setResult(res)
    } catch {
      toast('AI request failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔬 AI Study Lab</h1>
          <p className="page-subtitle">Your personal AI-powered study space</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>
            📁 {docContent ? 'Change Doc' : 'Upload Doc'}
          </button>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept=".pdf,.txt,.md" />
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab==='guide'?'active':''}`} onClick={()=>setTab('guide')}>📖 Study Guide</button>
        <button className={`tab ${tab==='quiz'?'active':''}`} onClick={()=>setTab('quiz')}>📝 Quiz Generator</button>
        <button className={`tab ${tab==='docchat'?'active':''}`} onClick={()=>setTab('docchat')}>💬 Chat with Doc</button>
        <button className={`tab ${tab==='deepdive'?'active':''}`} onClick={()=>setTab('deepdive')}>🤿 Deep Dive</button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          {tab === 'guide' && <GuideForm onGenerate={(d) => handleAction('guide', d)} />}
          {tab === 'quiz' && <QuizForm onGenerate={(d) => handleAction('quiz', d)} />}
          {tab === 'docchat' && <DocChat docContent={docContent} chat={chat} setChat={setChat} />}
          {tab === 'deepdive' && <DeepDiveForm onGenerate={(d) => handleAction('deepdive', d)} />}
          {tab === 'quiz-view' && <QuizView quiz={quiz} onBack={() => setTab('quiz')} />}
        </div>

        <div className="result-area">
          {loading && (
            <div className="card-glass" style={{ textAlign: 'center', padding: 60 }}>
              <div className="spinner" style={{ margin: '0 auto 20px' }} />
              <p>AI is thinking...</p>
            </div>
          )}
          
          {result && !loading && (
            <div className="card animate-slide-up">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            </div>
          )}

          {!result && !loading && tab !== 'quiz-view' && (
            <div className="card-glass" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✨</div>
              <h3>Ready to start?</h3>
              <p style={{ color: 'var(--text-muted)' }}>Configure the tool on the left and click generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GuideForm({ onGenerate }) {
  const [form, setForm] = useState({ subject: '', topic: '', level: 'High School' })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3>Study Guide Generator</h3>
      <input className="form-input" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} />
      <input className="form-input" placeholder="Topic" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} />
      <button className="btn btn-primary" onClick={() => onGenerate(form)}>Generate Guide</button>
    </div>
  )
}

function QuizForm({ onGenerate }) {
  const [form, setForm] = useState({ subject: '', topic: '', difficulty: 'Medium', count: 5 })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3>Quiz Generator</h3>
      <input className="form-input" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} />
      <input className="form-input" placeholder="Topic" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} />
      <select className="form-select" value={form.difficulty} onChange={e=>setForm({...form, difficulty:e.target.value})}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <button className="btn btn-primary" onClick={() => onGenerate(form)}>Generate Quiz</button>
    </div>
  )
}

function DocChat({ docContent, chat, setChat }) {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const send = async () => {
    if (!msg.trim()) return
    const newChat = [...chat, { role: 'user', content: msg }]
    setChat(newChat)
    setMsg('')
    setLoading(true)
    try {
      const res = await chatWithAI(newChat, `Context from document:\n${docContent.slice(0, 5000)}`)
      setChat([...newChat, { role: 'assistant', content: res }])
    } catch {
      toast('Failed to get response', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!docContent) return <div style={{ textAlign: 'center', padding: 20 }}>Please upload a document to start chatting.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: 400 }}>
      <h3>Chat with Document</h3>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
        {chat.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-card)', color: m.role === 'user' ? 'white' : 'var(--text)', padding: '8px 12px', borderRadius: 12, maxWidth: '80%', fontSize: '0.9rem' }}>
            {m.content}
          </div>
        ))}
        {loading && <div className="spinner-sm" />}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="form-input" placeholder="Ask something..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  )
}

function DeepDiveForm({ onGenerate }) {
  const [concept, setConcept] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3>Deep Dive</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter a complex concept and we'll break it down using the Feynman Technique.</p>
      <input className="form-input" placeholder="e.g. Quantum Entanglement" value={concept} onChange={e=>setConcept(e.target.value)} />
      <button className="btn btn-primary" onClick={() => onGenerate(concept)}>Start Deep Dive</button>
    </div>
  )
}

function QuizView({ quiz, onBack }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  if (!quiz) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Your Quiz</h3>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
      </div>
      {quiz.map((q, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>{i + 1}. {q.question}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => (
              <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 6, cursor: 'pointer', background: showResults && q.answer === oi ? 'rgba(0,255,0,0.1)' : 'transparent' }}>
                <input type="radio" name={`q${i}`} checked={answers[i] === oi} onChange={() => setAnswers({ ...answers, [i]: oi })} disabled={showResults} />
                <span style={{ fontSize: '0.9rem' }}>{opt}</span>
              </label>
            ))}
          </div>
          {showResults && (
            <div style={{ marginTop: 10, fontSize: '0.8rem', color: answers[i] === q.answer ? 'var(--success)' : 'var(--accent)', padding: 8, borderRadius: 4, background: 'var(--bg-body)' }}>
              {answers[i] === q.answer ? '✅ Correct!' : `❌ Incorrect. The answer is: ${q.options[q.answer]}`}
              <div style={{ marginTop: 4, opacity: 0.8 }}>{q.explanation}</div>
            </div>
          )}
        </div>
      ))}
      {!showResults && (
        <button className="btn btn-primary" onClick={() => setShowResults(true)}>Submit Answers</button>
      )}
    </div>
  )
}
