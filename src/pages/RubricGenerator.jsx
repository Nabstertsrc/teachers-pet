import { useState } from 'react'
import { generateRubric } from '../lib/gemini'
import { exportToDocx } from '../lib/export'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SUBJECTS = ['Mathematics','English','Natural Sciences','Life Skills','Economic Management Sciences','Social Sciences','Technology','Creative Arts','Life Orientation','Other']

export default function RubricGenerator() {
  const toast = useToast()
  const [form, setForm] = useState({ subject:'', grade:'', taskDescription:'', criteriaCount:4, levelCount:4 })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!form.subject || !form.taskDescription) { toast('Fill in subject and task description', 'warning'); return }
    setGenerating(true); setResult('')
    try {
      const rubric = await generateRubric(form)
      setResult(rubric)
      toast('Rubric generated! 📏', 'success')
    } catch { toast('Generation failed', 'error') }
    finally { setGenerating(false) }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📏 Rubric Generator</h1><p className="page-subtitle">Create detailed marking rubrics for any task</p></div>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        <div className="card">
          <h3 style={{ marginBottom:16 }}>Rubric Details</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="form-group"><label className="form-label">Subject</label><select className="form-select" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}><option value="">Select…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Grade</label><input className="form-input" placeholder="e.g. Grade 7" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Task Description</label><textarea className="form-textarea" rows={4} placeholder="e.g. Oral presentation on ecosystems, Research project on French Revolution..." value={form.taskDescription} onChange={e=>setForm({...form,taskDescription:e.target.value})} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Number of Criteria</label><select className="form-select" value={form.criteriaCount} onChange={e=>setForm({...form,criteriaCount:e.target.value})}>{[3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Number of Levels</label><select className="form-select" value={form.levelCount} onChange={e=>setForm({...form,levelCount:e.target.value})}>{[3,4,5,7].map(n=><option key={n}>{n}</option>)}</select></div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : '📏 Generate Rubric'}
            </button>
          </div>
        </div>

        <div>
          {generating && <div className="loading-overlay"><div className="spinner"/><p className="loading-text">Crafting your rubric...</p></div>}
          {result && (
            <div className="card animate-slide-up">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <h3>Preview</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => exportToDocx({ title:'Rubric', content:result, filename:'Rubric' })}>📥 Word</button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            </div>
          )}
          {!result && !generating && (
            <div className="card-glass" style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📏</div>
              <h3>Ready to mark?</h3>
              <p style={{ color:'var(--text-muted)' }}>Generate a professional rubric to ensure fair and consistent assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
