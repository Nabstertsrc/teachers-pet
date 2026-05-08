import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { generateLesson } from '../lib/gemini'
import { addLesson, getLessons, deleteLesson, getSettings } from '../lib/storage'
import { exportToDocx, exportToPDF, parseDocxTemplate } from '../lib/export'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Mermaid from '../components/Mermaid'

const SA_LANGUAGES = ['isiZulu','isiXhosa','Afrikaans','English','Sepedi','Sesotho','Setswana','Xitsonga','Tshivenda','siSwati','isiNdebele']
const SUBJECTS = [
  ...SA_LANGUAGES.map(l => `${l} Home Language`),
  ...SA_LANGUAGES.map(l => `${l} First Additional Language`),
  'Mathematics','Natural Sciences','Life Skills','Economic Management Sciences','Social Sciences','Technology','Creative Arts','Life Orientation','Physical Sciences','Life Sciences','Accounting','Business Studies','History','Geography','Computer Applications Technology','Other'
]
const GRADES = ['Grade R','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College Level','University Level']
const STYLES = [{ value:'formal', label:'Formal / Direct Instruction' },{ value:'activity', label:'Activity-Based Learning' },{ value:'flipped', label:'Flipped Classroom' },{ value:'inquiry', label:'Inquiry-Based Learning' },{ value:'collaborative', label:'Collaborative Learning' }]
const DURATIONS = ['30','45','60','90','120']
const LANGUAGES = [...SA_LANGUAGES, 'English (Other)', 'Other']

export default function LessonGenerator() {
  const location = useLocation()
  const toast = useToast()
  const [settings, setSettings] = useState({})
  const prefill = location.state?.prefill || {}

  const [form, setForm] = useState({ subject: '', grade: '', topic: prefill.topic || '', duration: '60', objectives: '', language: 'English', style: 'formal', extraDetails: '', ...prefill })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [tab, setTab] = useState('generate')
  const [lessons, setLessons] = useState([])
  const [school, setSchool] = useState(null)
  const [templateFile, setTemplateFile] = useState(null)
  const [templateText, setTemplateText] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const [s, l, sch] = await Promise.all([getSettings(), getLessons(), getSchoolProfile()])
      setSettings(s)
      setLessons(l)
      setSchool(sch)
    }
    load()
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = async () => {
    if (!form.subject || !form.grade || !form.topic) { toast('Please fill in Subject, Grade, and Topic', 'warning'); return }
    setGenerating(true)
    setResult('')
    try {
      const text = await generateLesson(form)
      setResult(text)
      setTab('preview')
    } catch (e) {
      toast('AI generation failed. Check your API key in Settings.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    await addLesson({ title: form.topic, subject: form.subject, grade: form.grade, topic: form.topic, content: result, duration: form.duration, style: form.style })
    const updated = await getLessons()
    setLessons(updated)
    toast('Lesson saved! ✅', 'success')
  }

  const handleExportDocx = () => {
    if (!result) return
    exportToDocx({ title: form.topic, content: result, filename: `Lesson_${form.topic.replace(/\s/g,'_')}`, school, subject: form.subject, grade: form.grade })
    toast('Exported to Word! 📄', 'success')
  }

  const handleExportPdf = () => { exportToPDF('lesson-preview', `Lesson_${form.topic.replace(/\s/g,'_')}`); toast('Exported to PDF! 📄', 'success') }

  const handleTemplateUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setTemplateFile(file.name)
    try { const text = await parseDocxTemplate(file); setTemplateText(text); toast('Template uploaded!', 'success') }
    catch { toast('Could not read template. Use a .docx file.', 'error') }
  }

  const handleDelete = async (id) => { 
    await deleteLesson(id)
    const updated = await getLessons()
    setLessons(updated)
    toast('Lesson deleted', 'info') 
  }

  const filtered = lessons.filter(l => `${l.title} ${l.subject} ${l.grade}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📚 Lesson Generator</h1><p className="page-subtitle">AI-powered lesson plans, ready to download and edit</p></div>
      </div>

      <div className="tabs">
        {['generate','preview','library'].map(t => <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t==='generate'?'⚡ Generate':t==='preview'?'👁️ Preview':'📂 My Lessons'}</button>)}
      </div>

      {tab === 'generate' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Lesson Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Subject *</label><select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">Select subject…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Grade *</label><select className="form-select" value={form.grade} onChange={e=>set('grade',e.target.value)}><option value="">Select grade…</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Topic *</label><input className="form-input" placeholder="e.g. Photosynthesis, Quadratic Equations…" value={form.topic} onChange={e=>set('topic',e.target.value)} /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Duration (min)</label><select className="form-select" value={form.duration} onChange={e=>set('duration',e.target.value)}>{DURATIONS.map(d=><option key={d}>{d}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Language</label><select className="form-select" value={form.language} onChange={e=>set('language',e.target.value)}>{LANGUAGES.map(l=><option key={l}>{l}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Teaching Style</label><select className="form-select" value={form.style} onChange={e=>set('style',e.target.value)}>{STYLES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Learning Objectives</label><textarea className="form-textarea" placeholder="What should learners know / be able to do by the end?" value={form.objectives} onChange={e=>set('objectives',e.target.value)} rows={3} /></div>
              <div className="form-group"><label className="form-label">Additional Details</label><textarea className="form-textarea" placeholder="Any special requirements, prior knowledge, resources to include…" value={form.extraDetails} onChange={e=>set('extraDetails',e.target.value)} rows={2} /></div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>📎 Upload Template (Optional)</h3>
              <p style={{ fontSize:'0.85rem', marginBottom:14 }}>Upload your school's .docx template — AI will match its format.</p>
              <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'20px', border:'2px dashed var(--border-light)', borderRadius:'var(--radius)', cursor:'pointer', transition:'border-color var(--transition)' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-light)'}>
                <span style={{ fontSize:'2rem' }}>📄</span>
                <span style={{ color:'var(--text-secondary)', fontSize:'0.87rem' }}>{templateFile || 'Click to upload .docx template'}</span>
                <input type="file" accept=".docx" style={{ display:'none' }} onChange={handleTemplateUpload} />
              </label>
              {templateText && <div style={{ marginTop:10, padding:'8px 12px', background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', fontSize:'0.78rem', color:'var(--text-muted)' }}>✅ Template loaded ({templateText.length} chars)</div>}
            </div>

            <div className="card" style={{ background:'linear-gradient(135deg,rgba(0,120,212,0.1),rgba(0,120,212,0.05))' }}>
              <h3 style={{ marginBottom: 12 }}>🎙️ Voice Commands</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Use the voice bar below and say:</p>
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
                {['"Generate a lesson on gravity for Grade 9"','"Create a lesson about the water cycle"'].map((c,i)=>(
                  <div key={i} style={{ background:'var(--bg-surface)', padding:'6px 10px', borderRadius:'var(--radius-sm)', fontSize:'0.8rem', color:'var(--primary)', fontStyle:'italic' }}>{c}</div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating} style={{ width:'100%' }}>
              {generating ? <><div className="generating-dots"><span/><span/><span/></div> Generating…</> : '⚡ Generate Lesson Plan'}
            </button>
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div>
          {!result && !generating && (
            <div className="empty-state"><div className="empty-state-icon">📚</div><h3>No lesson generated yet</h3><p>Go to Generate tab and create a lesson</p><button className="btn btn-primary" onClick={()=>setTab('generate')}>Go to Generate</button></div>
          )}
          {generating && (
            <div className="loading-overlay"><div className="spinner"/><p className="loading-text">AI is crafting your lesson plan…</p></div>
          )}
          {result && (
            <>
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                <button className="btn btn-success" onClick={handleSave}>💾 Save</button>
                <button className="btn btn-primary" onClick={handleExportDocx}>📄 Word</button>
                <button className="btn btn-secondary" onClick={handleExportPdf}>📑 PDF</button>
                <button className="btn btn-ghost" onClick={()=>document.getElementById('lesson-preview').requestFullscreen()}>📺 Fullscreen</button>
                <button className="btn btn-ghost" onClick={()=>setTab('generate')}>✏️ Edit</button>
              </div>
              <div id="lesson-preview" className="card lesson-fullscreen-capable" style={{ maxWidth:900, padding:40, margin: '0 auto' }}>
                <div style={{ textAlign:'center', borderBottom:'2px solid var(--border-light)', paddingBottom:20, marginBottom:20 }}>
                  {school?.logo && (
                    <div style={{ width: '100%', height: '220px', marginBottom: 20, overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                      <img src={school.logo} alt="School Letterhead" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                    </div>
                  )}
                  <div style={{ padding: '0 20px' }}>
                    <h2 style={{ fontSize:'1.1rem', fontWeight:700, margin:0 }}>{school?.name?.toUpperCase() || settings.schoolName?.toUpperCase()}</h2>
                    {school?.address && <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:'4px 0' }}>{school.address}</p>}
                    {(school?.phone || school?.email) && (
                      <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:0 }}>
                        {school.phone && `Tel: ${school.phone}`} {school.email && ` | ${school.email}`}
                      </p>
                    )}
                  </div>
                </div>
                <h1 style={{ fontSize:'1.4rem', margin:'12px 0', color:'var(--primary)', borderTop:'1px solid var(--border-light)', paddingTop:12 }}>{form.topic?.toUpperCase()}</h1>
                <div style={{ display:'flex', justifyContent:'center', gap:24, fontSize:'0.88rem', color:'var(--text-secondary)', marginTop:8 }}>
                  <span>Subject: {form.subject}</span><span>Grade: {form.grade}</span><span>Duration: {form.duration} min</span>
                </div>
                <div className="markdown-content">
                  {result.split(/(```mermaid[\s\S]*?```)/).map((part, i) => {
                    if (part.startsWith('```mermaid')) {
                      const chart = part.replace('```mermaid', '').replace('```', '').trim()
                      return <Mermaid key={i} chart={chart} />
                    }
                    return <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'library' && (
        <div>
          <div style={{ display:'flex', gap:12, marginBottom:20 }}>
            <div className="search-bar" style={{ flex:1 }}><span>🔍</span><input placeholder="Search lessons…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
            <button className="btn btn-primary" onClick={()=>setTab('generate')}>+ New Lesson</button>
          </div>
          {filtered.length === 0
            ? <div className="empty-state"><div className="empty-state-icon">📚</div><h3>No lessons found</h3><p>Create your first lesson plan!</p></div>
            : <div className="grid-auto">
                {filtered.map(l => (
                  <div key={l.id} className="card" style={{ cursor:'pointer' }} onClick={()=>{ setResult(l.content); setForm(f=>({...f,...l})); setTab('preview') }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <span className="badge badge-primary">{l.subject}</span>
                      <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();handleDelete(l.id)}} title="Delete">🗑️</button>
                    </div>
                    <h3 style={{ margin:'10px 0 6px', fontSize:'1rem' }}>{l.title || l.topic}</h3>
                    <p style={{ fontSize:'0.8rem' }}>{l.grade} · {l.duration} min · {l.style}</p>
                    <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:6 }}>{new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
      <style>{`
        .lesson-fullscreen-capable:fullscreen {
          background: white;
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          overflow-y: auto;
          padding: 60px !important;
          border-radius: 0;
        }
      `}</style>
    </div>
  )
}
