import { useState } from 'react'
import { generateReportComment } from '../lib/gemini'
import { getGradebook, getSchoolProfile, getSettings } from '../lib/storage'
import { exportToDocx } from '../lib/export'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect } from 'react'

export default function ReportCard() {
  const toast = useToast()
  const [gb, setGb] = useState({ classes: [] })
  const [activeClass, setActiveClass] = useState(null)
  const [activeStudent, setActiveStudent] = useState(null)
  const [form, setForm] = useState({ performance:'', personality:'', length:'medium' })
  const [generating, setGenerating] = useState(false)
  const [comment, setComment] = useState('')
  const [school, setSchool] = useState(null)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    const load = async () => {
      const [data, sch, s] = await Promise.all([getGradebook(), getSchoolProfile(), getSettings()])
      setGb(data)
      setSchool(sch)
      setSettings(s)
      if (data.classes?.length > 0) setActiveClass(data.classes[0].id)
    }
    load()
  }, [])

  const currentClass = gb.classes?.find(c => c.id === activeClass)
  const students = currentClass?.students || []

  const handleGenerate = async () => {
    const student = students.find(s => s.id === activeStudent)
    if (!student || !form.performance) { toast('Select student and describe performance', 'warning'); return }
    setGenerating(true); setComment('')
    try {
      const text = await generateReportComment({ studentName: student.name, subject: currentClass.name, ...form })
      setComment(text)
    } catch { toast('Comment generation failed', 'error') }
    finally { setGenerating(false) }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📜 Report Card Comments</h1><p className="page-subtitle">AI-crafted professional comments for your students</p></div>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        <div className="card">
          <h3 style={{ marginBottom:16 }}>Student Selection</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select className="form-select" value={activeClass} onChange={e => {setActiveClass(e.target.value); setActiveStudent(null)}}>
                {gb.classes?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Student</label>
              <select className="form-select" value={activeStudent} onChange={e => setActiveStudent(e.target.value)}>
                <option value="">Select Student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <hr style={{ border:0, borderTop:'1px solid var(--border)', margin:'8px 0' }} />
            
            <div className="form-group">
              <label className="form-label">Academic Performance</label>
              <textarea className="form-textarea" placeholder="e.g. Struggled with fractions, top of the class in history, excellent progress in reading..." value={form.performance} onChange={e=>setForm({...form, performance:e.target.value})} rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Personality / Behavior</label>
              <input className="form-input" placeholder="e.g. Helpful, quiet, needs to focus more..." value={form.personality} onChange={e=>setForm({...form, personality:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Comment Length</label>
              <select className="form-select" value={form.length} onChange={e=>setForm({...form, length:e.target.value})}>
                <option value="short">Short (1-2 sentences)</option>
                <option value="medium">Medium (Standard paragraph)</option>
                <option value="long">Long (Detailed assessment)</option>
              </select>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating || !activeStudent}>
              {generating ? 'Drafting...' : '✍️ Generate Comment'}
            </button>
          </div>
        </div>

        <div>
          {generating && <div className="loading-overlay"><div className="spinner"/><p className="loading-text">Crafting the perfect comment...</p></div>}
          {comment && (
            <div className="card animate-slide-up" style={{ padding: 40 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h3>Draft Comment</h3>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => exportToDocx({ title:'Report Comment', content:comment, filename:'Report_Comment', school })}>📥 Word</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setComment('')}>🗑️ Clear</button>
                </div>
              </div>
              <div id="report-preview" style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ textAlign:'center', borderBottom:'1px solid var(--border-light)', paddingBottom:16, marginBottom:16 }}>
                  {school?.logo && (
                    <div style={{ width: '100%', height: '160px', marginBottom: 16, overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      <img src={school.logo} alt="School Letterhead" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                    </div>
                  )}
                  <h4 style={{ margin:0, fontSize:'0.95rem', fontWeight:700 }}>{school?.name?.toUpperCase() || settings.schoolName?.toUpperCase()}</h4>
                  <p style={{ margin:'4px 0 0', fontSize:'0.75rem', color:'var(--text-muted)' }}>Official Progress Report Comment</p>
                </div>
                <div className="markdown-content" style={{ fontSize:'0.9rem' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment}</ReactMarkdown>
                </div>
              </div>
              <p style={{ marginTop:14, fontSize:'0.78rem', color:'var(--text-muted)' }}>💡 Pro-tip: You can export this to Word to include the full letterhead.</p>
            </div>
          )}
          {!comment && !generating && (
            <div className="card-glass" style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📜</div>
              <h3>Save hours of writing!</h3>
              <p style={{ color:'var(--text-muted)' }}>Generate professional, personalized comments for every student in seconds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
