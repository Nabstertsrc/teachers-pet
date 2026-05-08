import { useState, useEffect } from 'react'
import { getQMS, addQMS, getInterventions, addIntervention, getGradebook } from '../lib/storage'
import { generateInterventionStrategy } from '../lib/gemini'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const QMS_CRITERIA = [
  { id: 1, title: 'Creation of a Positive Learning Environment', desc: 'Teacher creates an environment that is conducive to teaching and learning.' },
  { id: 2, title: 'Knowledge of Curriculum and Learning Programmes', desc: 'Teacher demonstrates adequate knowledge of the curriculum and subject.' },
  { id: 3, title: 'Lesson Planning, Preparation and Presentation', desc: 'Teacher plans and prepares lessons effectively.' },
  { id: 4, title: 'Learner Assessment and Achievement', desc: 'Teacher uses various assessment forms to monitor learner progress.' },
  { id: 5, title: 'Professional Development in Field of Work', desc: 'Teacher participates in professional development activities.' }
]

export default function Professionalism() {
  const toast = useToast()
  const [tab, setTab] = useState('intervention')
  const [qmsRecords, setQmsRecords] = useState([])
  const [interventions, setInterventions] = useState([])
  const [gb, setGb] = useState({ classes: [] })
  
  // QMS Form
  const [qmsForm, setQmsForm] = useState({ type: 'Self-Assessment', scores: {}, evidence: '' })
  
  // Intervention Form
  const [intForm, setIntForm] = useState({ studentId: '', studentName: '', grade: '', subject: '', issue: '', context: '' })
  const [generating, setGenerating] = useState(false)
  const [aiStrategy, setAiStrategy] = useState('')

  useEffect(() => {
    const load = async () => {
      const [q, i, g] = await Promise.all([getQMS(), getInterventions(), getGradebook()])
      setQmsRecords(q)
      setInterventions(i)
      setGb(g)
    }
    load()
  }, [])

  const handleSaveQMS = async () => {
    await addQMS(qmsForm)
    setQmsRecords(await getQMS())
    toast('QMS Assessment saved! ✅', 'success')
  }

  const handleGenerateStrategy = async () => {
    if (!intForm.studentName || !intForm.issue) { toast('Please enter student name and issue', 'warning'); return }
    setGenerating(true)
    try {
      const strategy = await generateInterventionStrategy(intForm)
      setAiStrategy(strategy)
      toast('AI Strategy Generated!', 'success')
    } catch { toast('Generation failed', 'error') }
    finally { setGenerating(false) }
  }

  const handleSaveIntervention = async () => {
    await addIntervention({ ...intForm, strategy: aiStrategy, date: new Date().toISOString() })
    setInterventions(await getInterventions())
    toast('Intervention record saved! 📝', 'success')
    setAiStrategy('')
    setIntForm({ studentId: '', studentName: '', grade: '', subject: '', issue: '', context: '' })
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Professionalism & Support</h1>
          <p className="page-subtitle">QMS compliance and learner intervention tools</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab==='intervention'?'active':''}`} onClick={()=>setTab('intervention')}>🎯 Learner Intervention</button>
        <button className={`tab ${tab==='qms'?'active':''}`} onClick={()=>setTab('qms')}>📋 QMS Assessment</button>
      </div>

      {tab === 'intervention' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>New Intervention Record</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input className="form-input" placeholder="Enter student name" value={intForm.studentName} onChange={e=>setIntForm({...intForm, studentName: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Grade</label>
                  <input className="form-input" placeholder="e.g. 10" value={intForm.grade} onChange={e=>setIntForm({...intForm, grade: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" placeholder="e.g. Maths" value={intForm.subject} onChange={e=>setIntForm({...intForm, subject: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nature of Challenge (Issue)</label>
                <select className="form-select" value={intForm.issue} onChange={e=>setIntForm({...intForm, issue: e.target.value})}>
                  <option value="">Select...</option>
                  <option>Academic Underperformance</option>
                  <option>Behavioral Issues</option>
                  <option>Frequent Absenteeism</option>
                  <option>Lack of Participation</option>
                  <option>Emotional/Social Support needed</option>
                  <option>Learning Disability suspected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Context / Observations</label>
                <textarea className="form-textarea" rows={3} placeholder="Describe what you have observed..." value={intForm.context} onChange={e=>setIntForm({...intForm, context: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleGenerateStrategy} disabled={generating}>
                  {generating ? 'Generating...' : '🤖 AI Strategy Advice'}
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveIntervention}>Save Record</button>
              </div>
            </div>
          </div>

          <div>
            {aiStrategy && (
              <div className="card animate-slide-up" style={{ marginBottom: 20, borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3>🤖 AI Intervention Strategy</h3>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setAiStrategy('')}>✕</button>
                </div>
                <div className="markdown-content" style={{ fontSize: '0.88rem' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiStrategy}</ReactMarkdown>
                </div>
              </div>
            )}

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Recent Interventions</h3>
              {interventions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No intervention records yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {interventions.map(i => (
                    <div key={i.id} className="card-glass" style={{ padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{i.studentName}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{i.issue}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {i.subject} · Grade {i.grade} · {new Date(i.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'qms' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Quality Management Self-Assessment</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Rate yourself on the following QMS Performance Standards (1-4).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {QMS_CRITERIA.map(c => (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{c.title}</label>
                    <select 
                      className="form-select" 
                      style={{ width: 60, padding: '4px' }}
                      value={qmsForm.scores[c.id] || ''}
                      onChange={e => setQmsForm({ ...qmsForm, scores: { ...qmsForm.scores, [c.id]: e.target.value } })}
                    >
                      <option value="">-</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.desc}</p>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Notes on Evidence</label>
                <textarea className="form-textarea" placeholder="Mention files, lessons, or results that serve as evidence..." value={qmsForm.evidence} onChange={e=>setQmsForm({...qmsForm, evidence: e.target.value})} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveQMS}>Save QMS Review</button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Assessment History</h3>
            {qmsRecords.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No assessments recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {qmsRecords.map(r => (
                  <div key={r.id} className="card-glass" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{r.type}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Object.entries(r.scores).map(([id, score]) => (
                        <div key={id} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          PS{id}: <strong>{score}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
