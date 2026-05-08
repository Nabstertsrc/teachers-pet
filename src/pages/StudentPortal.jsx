import { useState, useEffect } from 'react'
import { generateStudyGuide, generateFlashcards } from '../lib/gemini'
import { getStudentNotes, saveStudentNote, getLessons } from '../lib/storage'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SUBJECTS = ['Mathematics','English','Afrikaans','Natural Sciences','Life Sciences','Physical Sciences','Geography','History','Life Orientation','Technology','Economics','Business Studies','Accounting','Other']
const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']

export default function StudentPortal() {
  const toast = useToast()
  const [lessons, setLessons] = useState([])
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ subject:'', grade:'', topic:'', lessonId:'' })
  const [generating, setGenerating] = useState(false)
  const [studyGuide, setStudyGuide] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flashcardIdx, setFlashcardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [fcForm, setFcForm] = useState({ subject:'', grade:'', topic:'', count:10 })
  const [generatingFC, setGeneratingFC] = useState(false)
  
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => {
    const load = async () => {
      const [l, n] = await Promise.all([getLessons(), getStudentNotes()])
      setLessons(l)
      setNotes(n)
    }
    load()
  }, [])

  const handleGenerateGuide = async () => {
    if (!form.subject || !form.topic) { toast('Select subject and topic', 'warning'); return }
    setGenerating(true); setStudyGuide('')
    try {
      const selectedLesson = lessons.find(l => l.id === form.lessonId)
      const guide = await generateStudyGuide({ ...form, lessonContent: selectedLesson?.content || '' })
      setStudyGuide(guide)
      await saveStudentNote({ subject: form.subject, grade: form.grade, topic: form.topic, content: guide })
      const updatedNotes = await getStudentNotes()
      setNotes(updatedNotes)
      toast('Study guide generated!', 'success')
    } catch { toast('Generation failed', 'error') }
    finally { setGenerating(false) }
  }

  const handleGenerateFlashcards = async () => {
    if (!fcForm.subject || !fcForm.topic) { toast('Enter subject and topic', 'warning'); return }
    setGeneratingFC(true); setFlashcards([])
    try {
      const cards = await generateFlashcards(fcForm)
      if (cards.length) { setFlashcards(cards); setFlashcardIdx(0); setFlipped(false); toast(`${cards.length} flashcards created!`, 'success') }
      else toast('No cards generated. Try again.', 'warning')
    } catch { toast('Generation failed', 'error') }
    finally { setGeneratingFC(false) }
  }

  const currentCard = flashcards[flashcardIdx]

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">🎓 Student Portal</h1><p className="page-subtitle">Study guides, flashcards, and shared lesson notes</p></div>
      </div>

      <div className="tabs">
        {['notes','studyguide','flashcards'].map(t=><button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t==='notes'?'📚 Lesson Notes':t==='studyguide'?'📖 Study Guide':'🃏 Flashcards'}</button>)}
      </div>

      {tab === 'notes' && (
        <div>
          <h3 style={{ marginBottom:16 }}>Shared Lesson Notes</h3>
          {lessons.length === 0
            ? <div className="empty-state"><div className="empty-state-icon">📚</div><h3>No lesson notes available</h3><p>Teachers need to create and save lessons first</p></div>
            : <div className="grid-auto">
                {lessons.map(l=>(
                  <div key={l.id} className="card" onClick={()=>{ setForm(f=>({...f,subject:l.subject,grade:l.grade,topic:l.topic,lessonId:l.id})); setTab('studyguide') }} style={{ cursor:'pointer' }}>
                    <span className="badge badge-primary" style={{ marginBottom:10 }}>{l.subject}</span>
                    <h3 style={{ fontSize:'0.95rem', marginBottom:6 }}>{l.topic}</h3>
                    <p style={{ fontSize:'0.8rem' }}>{l.grade} · {l.duration} min</p>
                    <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:6 }}>{new Date(l.createdAt).toLocaleDateString()}</p>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop:12, width:'100%' }}>📖 Generate Study Guide →</button>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {tab === 'studyguide' && (
        <div className="grid-2" style={{ alignItems:'start' }}>
          <div className="card">
            <h3 style={{ marginBottom:16 }}>📖 Generate Study Guide</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Subject *</label><select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">Select…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Grade *</label><select className="form-select" value={form.grade} onChange={e=>set('grade',e.target.value)}><option value="">Select…</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Topic *</label><input className="form-input" placeholder="e.g. Photosynthesis" value={form.topic} onChange={e=>set('topic',e.target.value)} /></div>
              {lessons.length > 0 && (
                <div className="form-group"><label className="form-label">Based on Lesson (optional)</label>
                  <select className="form-select" value={form.lessonId} onChange={e=>set('lessonId',e.target.value)}>
                    <option value="">None — generate from scratch</option>
                    {lessons.map(l=><option key={l.id} value={l.id}>{l.topic} ({l.subject})</option>)}
                  </select>
                </div>
              )}
              <button className="btn btn-primary btn-lg" onClick={handleGenerateGuide} disabled={generating}>
                {generating ? <><div className="generating-dots"><span/><span/><span/></div>Generating…</> : '📖 Generate Study Guide'}
              </button>
            </div>
          </div>

          <div>
            {!studyGuide && !generating && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <h3>📚 Recent Study Guides</h3>
                {notes.length === 0 ? (
                   <div className="card-glass" style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>No saved guides yet</div>
                ) : (
                  notes.slice(0,5).map(n=>(
                    <div key={n.id} className="card" style={{ cursor:'pointer', padding:'14px 18px' }} onClick={()=>setStudyGuide(n.content)}>
                      <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{n.topic}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:4 }}>{n.subject} · {n.grade} · {new Date(n.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}
            {generating && <div className="loading-overlay"><div className="spinner"/><p className="loading-text">Creating your study guide…</p></div>}
            {studyGuide && (
              <div className="card animate-slide-up" style={{ maxWidth:700 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <h3 style={{ color: 'var(--primary-light)' }}>📖 Study Guide</h3>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setStudyGuide('')}>✕ Close</button>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{studyGuide}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'flashcards' && (
        <div>
          {flashcards.length === 0 ? (
            <div className="grid-2" style={{ alignItems:'start' }}>
              <div className="card">
                <h3 style={{ marginBottom:16 }}>🃏 Create Flashcards</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="form-group"><label className="form-label">Subject</label><select className="form-select" value={fcForm.subject} onChange={e=>setFcForm(f=>({...f,subject:e.target.value}))}><option value="">Select…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Grade</label><select className="form-select" value={fcForm.grade} onChange={e=>setFcForm(f=>({...f,grade:e.target.value}))}><option value="">Select…</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Topic</label><input className="form-input" placeholder="e.g. The Water Cycle" value={fcForm.topic} onChange={e=>setFcForm(f=>({...f,topic:e.target.value}))} /></div>
                  <div className="form-group"><label className="form-label">Number of Cards</label><select className="form-select" value={fcForm.count} onChange={e=>setFcForm(f=>({...f,count:e.target.value}))}>{[5,8,10,15,20].map(n=><option key={n}>{n}</option>)}</select></div>
                  <button className="btn btn-primary btn-lg" onClick={handleGenerateFlashcards} disabled={generatingFC}>
                    {generatingFC ? <><div className="generating-dots"><span/><span/><span/></div>Creating…</> : '🃏 Generate Flashcards'}
                  </button>
                </div>
              </div>
              <div className="card" style={{ background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,217,196,0.05))' }}>
                <h3 style={{ marginBottom:12 }}>How Flashcards Work</h3>
                <p style={{ fontSize:'0.87rem', lineHeight:1.7 }}>AI generates question/answer pairs for your topic. Click the card to flip between question and answer. Use arrow buttons to navigate.</p>
                <div style={{ marginTop:16, padding:'16px', background:'var(--bg-surface)', borderRadius:'var(--radius)', textAlign:'center' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🃏</div>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>Click card to flip • Arrow keys to navigate</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, maxWidth:600, margin:'0 auto' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{flashcardIdx+1} / {flashcards.length}</span>
                <div className="progress-bar" style={{ width:200 }}><div className="progress-fill" style={{ width:`${((flashcardIdx+1)/flashcards.length)*100}%` }}/></div>
                <button className="btn btn-ghost btn-sm" onClick={()=>setFlashcards([])}>✕ New Set</button>
              </div>

              <div onClick={()=>setFlipped(f=>!f)} style={{ width:'100%', minHeight:260, perspective:1000, cursor:'pointer' }}>
                <div style={{ position:'relative', width:'100%', minHeight:260, transformStyle:'preserve-3d', transform:flipped?'rotateY(180deg)':'rotateY(0deg)', transition:'transform 0.5s ease' }}>
                  <div style={{ position:'absolute', width:'100%', backfaceVisibility:'hidden', background:'linear-gradient(135deg,var(--primary),var(--primary-dark))', borderRadius:'var(--radius-xl)', padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:260 }}>
                    <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.6)', marginBottom:16, letterSpacing:'0.1em', textTransform:'uppercase' }}>Question</div>
                    <h2 style={{ color:'#fff', textAlign:'center', fontSize:'1.2rem', lineHeight:1.5 }}>{currentCard?.front}</h2>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', marginTop:24 }}>Click to reveal answer ›</p>
                  </div>
                  <div style={{ position:'absolute', width:'100%', backfaceVisibility:'hidden', transform:'rotateY(180deg)', background:'linear-gradient(135deg,var(--secondary),#009B8E)', borderRadius:'var(--radius-xl)', padding:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:260 }}>
                    <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.6)', marginBottom:16, letterSpacing:'0.1em', textTransform:'uppercase' }}>Answer</div>
                    <p style={{ color:'#fff', textAlign:'center', fontSize:'1.05rem', lineHeight:1.6 }}>{currentCard?.back}</p>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                <button className="btn btn-secondary" onClick={()=>{setFlashcardIdx(i=>Math.max(0,i-1));setFlipped(false)}} disabled={flashcardIdx===0}>← Prev</button>
                <button className="btn btn-primary" onClick={()=>setFlipped(f=>!f)}>🔄 Flip</button>
                <button className="btn btn-secondary" onClick={()=>{setFlashcardIdx(i=>Math.min(flashcards.length-1,i+1));setFlipped(false)}} disabled={flashcardIdx===flashcards.length-1}>Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
