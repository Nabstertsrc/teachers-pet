import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { generateQuestions } from '../lib/gemini'
import { saveQuestionPaper, getQuestionPapers, deleteQuestionPaper, getSettings, getSchoolProfile } from '../lib/storage'
import { exportToDocx, exportToPDF } from '../lib/export'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Mermaid from '../components/Mermaid'

const SA_LANGUAGES = ['isiZulu','isiXhosa','Afrikaans','English','Sepedi','Sesotho','Setswana','Xitsonga','Tshivenda','siSwati','isiNdebele']
const SUBJECTS = [
  ...SA_LANGUAGES.map(l => `${l} Home Language`),
  ...SA_LANGUAGES.map(l => `${l} First Additional Language`),
  'Mathematics','Natural Sciences','Life Skills','Economic Management Sciences','Social Sciences','Technology','Creative Arts','Life Orientation','Physical Sciences','Life Sciences','Accounting','Business Studies','History','Geography','Other'
]
const GRADES = ['Grade R','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']
const SECTIONS = [
  { id:'mcq', label:'Multiple Choice (Section A)' },
  { id:'short', label:'Short Answer (Section B)' },
  { id:'long', label:'Long Answer / Essays (Section C)' },
  { id:'truefalse', label:'True or False' },
  { id:'matching', label:'Matching Column' },
  { id:'fillin', label:'Fill in the Blanks' },
  { id:'diagram', label:'Diagram / Label Questions' },
  { id:'calc', label:'Calculations / Problem Solving' },
]

export default function QuestionPaper() {
  const location = useLocation()
  const toast = useToast()
  const settingsPrefill = location.state?.prefill || {}
  const [form, setForm] = useState({ subject: settingsPrefill.subject||'', grade: settingsPrefill.grade||'', topic: '', totalMarks: '100', difficulty: 'mixed', includeAnswers: true, selectedSections: ['mcq','short','long'], customInstructions: '', timeAllowed: '2 hours', examType: 'Test' })
  const [settings, setSettings] = useState({})
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [tab, setTab] = useState('build')
  const [papers, setPapers] = useState([])
  const [diagrams, setDiagrams] = useState([])
  const [school, setSchool] = useState(null)

  // Load initial data
  useEffect(() => {
    const load = async () => {
      const [s, p, sch] = await Promise.all([getSettings(), getQuestionPapers(), getSchoolProfile()])
      setSettings(s)
      setPapers(p)
      setSchool(sch)
    }
    load()
  }, [])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const renderContent = (content) => {
    if (!content) return null
    // Split by mermaid blocks to render them separately
    const parts = content.split(/(```mermaid[\s\S]*?```)/)
    return parts.map((part, i) => {
      if (part.startsWith('```mermaid')) {
        const chart = part.replace('```mermaid', '').replace('```', '').trim()
        return <Mermaid key={i} chart={chart} />
      }
      return <ReactMarkdown key={i} className="markdown-content" remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>
    })
  }

  const toggleSection = (id) => {
    setForm(f => ({ ...f, selectedSections: f.selectedSections.includes(id) ? f.selectedSections.filter(s=>s!==id) : [...f.selectedSections, id] }))
  }

  const handleGenerate = async () => {
    if (!form.subject || !form.grade || !form.topic) { toast('Fill in Subject, Grade, and Topic', 'warning'); return }
    if (form.selectedSections.length === 0) { toast('Select at least one section type', 'warning'); return }
    setGenerating(true); setResult('')
    try {
      const sections = SECTIONS.filter(s => form.selectedSections.includes(s.id)).map(s => s.label).join(', ')
      const text = await generateQuestions({ ...form, sections })
      setResult(text); setTab('preview')
    } catch { toast('Generation failed. Check API key.', 'error') }
    finally { setGenerating(false) }
  }

  const handleSave = async () => { 
    await saveQuestionPaper({ ...form, content: result })
    const updated = await getQuestionPapers()
    setPapers(updated)
    toast('Paper saved!', 'success') 
  }

  const handleExportDocx = () => {
    exportToDocx({ title: `${form.examType}: ${form.subject} — ${form.topic}`, content: result, filename: `QP_${form.subject}_${form.grade}`.replace(/\s/g,'_'), school, subject: form.subject, grade: form.grade })
    toast('Exported to Word!', 'success')
  }

  const handleDiagramUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setDiagrams(d => [...d, { name: file.name, url: ev.target.result }])
      reader.readAsDataURL(file)
    })
    toast(`${files.length} diagram(s) added!`, 'success')
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📝 Question Paper Builder</h1><p className="page-subtitle">AI-generated exam papers with diagrams — print-ready Word & PDF export</p></div>
      </div>

      <div className="tabs">
        {['build','preview','library'].map(t=><button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t==='build'?'🔧 Build':t==='preview'?'👁️ Preview':'📂 Saved Papers'}</button>)}
      </div>

      {tab === 'build' && (
        <div className="grid-2" style={{ alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card">
              <h3 style={{ marginBottom:18 }}>Paper Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Subject *</label><select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">Select…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Grade *</label><select className="form-select" value={form.grade} onChange={e=>set('grade',e.target.value)}><option value="">Select grade…</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
                </div>
                <div className="form-group"><label className="form-label">Topic / Module *</label><input className="form-input" placeholder="e.g. Ecosystems, Algebra, World War 2…" value={form.topic} onChange={e=>set('topic',e.target.value)} /></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Exam Type</label><select className="form-select" value={form.examType} onChange={e=>set('examType',e.target.value)}>{['Test','Examination','Assignment','Quiz','Worksheet','Controlled Test'].map(x=><option key={x}>{x}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Total Marks</label><input className="form-input" type="number" min="10" max="300" value={form.totalMarks} onChange={e=>set('totalMarks',e.target.value)} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Time Allowed</label><select className="form-select" value={form.timeAllowed} onChange={e=>set('timeAllowed',e.target.value)}>{['30 minutes','45 minutes','1 hour','1.5 hours','2 hours','2.5 hours','3 hours'].map(x=><option key={x}>{x}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Difficulty</label><select className="form-select" value={form.difficulty} onChange={e=>set('difficulty',e.target.value)}>{[{v:'easy',l:'Easy'},{v:'medium',l:'Medium'},{v:'hard',l:'Hard'},{v:'mixed',l:'Mixed (Bloom\'s)'}].map(x=><option key={x.v} value={x.v}>{x.l}</option>)}</select></div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                    <input type="checkbox" checked={form.includeAnswers} onChange={e=>set('includeAnswers',e.target.checked)} style={{ width:16,height:16 }} />
                    Include Memorandum / Answer Sheet
                  </label>
                </div>
                <div className="form-group"><label className="form-label">Additional Instructions</label><textarea className="form-textarea" placeholder="Any special instructions for the paper…" value={form.customInstructions} onChange={e=>set('customInstructions',e.target.value)} rows={2} /></div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom:4 }}>📎 Diagrams</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:12 }}>Upload diagram images to include (will be referenced in paper)</p>
              <label style={{ display:'flex', alignItems:'center', gap:10, padding:'12px', border:'2px dashed var(--border-light)', borderRadius:'var(--radius)', cursor:'pointer' }}>
                <span>🖼️</span><span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>Upload diagram images (.png, .jpg)</span>
                <input type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleDiagramUpload} />
              </label>
              {diagrams.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
                  {diagrams.map((d,i)=>(
                    <div key={i} style={{ position:'relative' }}>
                      <img src={d.url} alt={d.name} style={{ width:70, height:70, objectFit:'cover', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }} />
                      <button onClick={()=>setDiagrams(ds=>ds.filter((_,j)=>j!==i))} style={{ position:'absolute',top:-6,right:-6,background:'var(--accent)',border:'none',color:'#fff',borderRadius:'50%',width:18,height:18,cursor:'pointer',fontSize:'0.7rem' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card">
              <h3 style={{ marginBottom:14 }}>📋 Question Sections</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:14 }}>Select which section types to include:</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {SECTIONS.map(s=>(
                  <label key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background: form.selectedSections.includes(s.id)?'rgba(0,120,212,0.1)':'var(--bg-surface)', border:`1px solid ${form.selectedSections.includes(s.id)?'var(--primary)':'var(--border)'}`, borderRadius:'var(--radius)', cursor:'pointer', transition:'all var(--transition)' }}>
                    <input type="checkbox" checked={form.selectedSections.includes(s.id)} onChange={()=>toggleSection(s.id)} style={{ width:16,height:16 }} />
                    <span style={{ fontSize:'0.88rem', color: form.selectedSections.includes(s.id)?'var(--primary)':'var(--text)' }}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width:'100%' }} onClick={handleGenerate} disabled={generating}>
              {generating ? <><div className="generating-dots"><span/><span/><span/></div> Generating…</> : '⚡ Generate Question Paper'}
            </button>
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div>
          {!result && !generating && <div className="empty-state"><div className="empty-state-icon">📝</div><h3>No paper yet</h3><button className="btn btn-primary" onClick={()=>setTab('build')}>Build a Paper</button></div>}
          {generating && <div className="loading-overlay"><div className="spinner"/><p className="loading-text">AI is building your question paper…</p></div>}
          {result && (
            <>
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                <button className="btn btn-success" onClick={handleSave}>💾 Save</button>
                <button className="btn btn-primary" onClick={handleExportDocx}>📄 Export Word</button>
                <button className="btn btn-secondary" onClick={()=>exportToPDF('qp-preview',`QP_${form.subject}_${form.grade}`)}>📑 Export PDF</button>
                <button className="btn btn-ghost" onClick={()=>exportToPDF('qp-preview',`QP_${form.subject}_${form.grade}`, 0.5)}>🗜️ Compressed PDF</button>
                <button className="btn btn-ghost" onClick={()=>setTab('build')}>✏️ Edit</button>
              </div>
              <div id="qp-preview" className="card" style={{ maxWidth:900, padding: 40 }}>
                <div style={{ textAlign:'center', borderBottom:'2px solid var(--border-light)', paddingBottom:20, marginBottom:20 }}>
                  {school?.logo && (
                    <div style={{ width: '100%', height: '180px', marginBottom: 20, overflow: 'hidden', borderRadius: 'var(--radius)' }}>
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
                <h1 style={{ fontSize:'1.3rem', margin:'12px 0', color:'var(--primary)', borderTop:'1px solid var(--border-light)', paddingTop:12 }}>{form.subject?.toUpperCase()} — {form.examType?.toUpperCase()}</h1>
                <div style={{ display:'flex', justifyContent:'center', gap:24, fontSize:'0.88rem', color:'var(--text-secondary)', marginTop:8 }}>
                  <span>Grade: {form.grade}</span><span>Total: {form.totalMarks} marks</span><span>Time: {form.timeAllowed}</span>
                </div>
                <div style={{ marginTop:12, padding:'10px', background:'var(--bg-surface)', borderRadius:'var(--radius)', fontSize:'0.82rem', textAlign:'left' }}>
                  <strong>Topic:</strong> {form.topic}
                </div>
                {diagrams.length > 0 && (
                  <div style={{ marginBottom:20, display:'flex', gap:12, flexWrap:'wrap' }}>
                    {diagrams.map((d,i)=>(
                      <div key={i} style={{ textAlign:'center' }}>
                        <img src={d.url} alt={`Diagram ${i+1}`} style={{ maxWidth:200, borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }} />
                        <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:4 }}>Figure {i+1}: {d.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                {renderContent(result)}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'library' && (
        <div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}><button className="btn btn-primary" onClick={()=>setTab('build')}>+ New Paper</button></div>
          {papers.length === 0
            ? <div className="empty-state"><div className="empty-state-icon">📝</div><h3>No saved papers</h3></div>
            : <div className="grid-auto">
                {papers.map(p=>(
                  <div key={p.id} className="card" style={{ cursor:'pointer' }} onClick={()=>{setResult(p.content);setForm(f=>({...f,...p}));setTab('preview')}}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <span className="badge badge-danger">{p.examType || 'Paper'}</span>
                      <button className="btn btn-ghost btn-sm" onClick={async e=>{e.stopPropagation(); await deleteQuestionPaper(p.id); setPapers(await getQuestionPapers())}}>🗑️</button>
                    </div>
                    <h3 style={{ margin:'10px 0 4px', fontSize:'1rem' }}>{p.subject} — {p.topic}</h3>
                    <p style={{ fontSize:'0.82rem' }}>{p.grade} · {p.totalMarks} marks · {p.difficulty}</p>
                    <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:6 }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  )
}
