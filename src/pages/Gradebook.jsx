import { useState, useEffect } from 'react'
import { getGradebook, saveGradebook } from '../lib/storage'
import { exportToCSV } from '../lib/export'
import { useToast } from '../context/AppContext'

const GRADES_LIST = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']

function getColor(pct) {
  if (pct >= 80) return 'var(--success)'
  if (pct >= 70) return '#4CAF50'
  if (pct >= 60) return 'var(--info)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--accent)'
}
function getSymbol(pct) {
  if (pct >= 80) return '7'; if (pct >= 70) return '6'; if (pct >= 60) return '5';
  if (pct >= 50) return '4'; if (pct >= 40) return '3'; if (pct >= 30) return '2'; return '1'
}

export default function Gradebook() {
  const toast = useToast()
  const [gb, setGb] = useState({ classes: [] })
  const [activeClass, setActiveClass] = useState(null)
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAddAssessment, setShowAddAssessment] = useState(false)
  const [newClass, setNewClass] = useState({ name:'', subject:'', grade:'' })
  const [newAssessment, setNewAssessment] = useState({ name:'', outOf:100, date: new Date().toISOString().split('T')[0], type:'Test' })

  useEffect(() => {
    const load = async () => {
      const data = await getGradebook()
      setGb(data)
      if (data.classes?.length > 0) setActiveClass(data.classes[0].id)
    }
    load()
  }, [])

  const currentClass = gb.classes?.find(c => c.id === activeClass)

  const save = async (updated) => { 
    setGb(updated)
    await saveGradebook(updated) 
  }

  const addClass = () => {
    if (!newClass.name) return
    const cls = { id: Date.now().toString(), ...newClass, students: [], assessments: [] }
    const updated = { ...gb, classes: [...(gb.classes || []), cls] }
    save(updated); setActiveClass(cls.id); setShowAddClass(false); setNewClass({ name:'', subject:'', grade:'' })
    toast('Class added!', 'success')
  }

  const addStudent = () => {
    const name = prompt('Enter student name:')
    if (!name?.trim()) return
    const student = { id: Date.now().toString(), name: name.trim(), marks: {} }
    const updated = { ...gb, classes: gb.classes.map(c => c.id===activeClass ? { ...c, students:[...c.students,student] } : c) }
    save(updated); toast('Student added!', 'success')
  }

  const addAssessment = () => {
    if (!newAssessment.name) return
    const assessment = { id: Date.now().toString(), ...newAssessment }
    const updated = { ...gb, classes: gb.classes.map(c => c.id===activeClass ? { ...c, assessments:[...c.assessments,assessment] } : c) }
    save(updated); setShowAddAssessment(false); setNewAssessment({ name:'', outOf:100, date: new Date().toISOString().split('T')[0], type:'Test' })
    toast('Assessment added!', 'success')
  }

  const updateMark = (studentId, assessmentId, value) => {
    const mark = parseFloat(value)
    const updated = { ...gb, classes: gb.classes.map(c => c.id!==activeClass ? c : {
      ...c, students: c.students.map(s => s.id!==studentId ? s : { ...s, marks: { ...s.marks, [assessmentId]: isNaN(mark) ? '' : mark } })
    })}
    save(updated)
  }

  const getAverage = (student) => {
    if (!currentClass) return 0
    const marks = currentClass.assessments.map(a => {
      const m = student.marks[a.id]; return m !== '' && m !== undefined ? (m / a.outOf) * 100 : null
    }).filter(x => x !== null)
    return marks.length ? (marks.reduce((a,b)=>a+b,0)/marks.length).toFixed(1) : '—'
  }

  const handleExportCSV = () => {
    if (!currentClass) return
    const data = currentClass.students.map(s => {
      const row = { 'Student Name': s.name }
      currentClass.assessments.forEach(a => { row[a.name] = s.marks[a.id] ?? '' })
      row['Average (%)'] = getAverage(s)
      return row
    })
    exportToCSV(data, `Gradebook_${currentClass.name}`)
    toast('Exported to CSV!', 'success')
  }

  const deleteStudent = (studentId) => {
    const updated = { ...gb, classes: gb.classes.map(c => c.id!==activeClass ? c : { ...c, students: c.students.filter(s=>s.id!==studentId) }) }
    save(updated)
  }

  const classAvg = currentClass ? (() => {
    const avgs = currentClass.students.map(s => parseFloat(getAverage(s))).filter(v => !isNaN(v))
    return avgs.length ? (avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(1) : '—'
  })() : '—'

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📊 Gradebook</h1><p className="page-subtitle">Track learner performance across assessments</p></div>
        <div style={{ display:'flex', gap:10 }}>
          {currentClass && <button className="btn btn-secondary" onClick={handleExportCSV}>📥 Export CSV</button>}
          <button className="btn btn-primary" onClick={()=>setShowAddClass(true)}>+ New Class</button>
        </div>
      </div>

      {/* Class Tabs */}
      {gb.classes?.length > 0 && (
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {gb.classes.map(c=>(
            <button key={c.id} onClick={()=>setActiveClass(c.id)} className={`btn ${activeClass===c.id?'btn-primary':'btn-secondary'} btn-sm`}>
              {c.name} {c.grade && `· ${c.grade}`}
            </button>
          ))}
        </div>
      )}

      {!currentClass ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No classes yet</h3>
          <p>Create a class to start tracking grades</p>
          <button className="btn btn-primary" onClick={()=>setShowAddClass(true)}>+ Create Class</button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid-4" style={{ marginBottom:20 }}>
            {[
              { label:'Students', value: currentClass.students.length, icon:'👥' },
              { label:'Assessments', value: currentClass.assessments.length, icon:'📝' },
              { label:'Class Average', value: `${classAvg}%`, icon:'📊' },
              { label:'Subject', value: currentClass.subject || '—', icon:'📚' },
            ].map((s,i)=><div key={i} className="stat-card"><div style={{fontSize:'1.4rem'}}>{s.icon}</div><div className="stat-value" style={{fontSize:'1.4rem',color:'var(--primary)'}}>{s.value}</div><div className="stat-label">{s.label}</div></div>)}
          </div>

          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={addStudent}>+ Add Student</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setShowAddAssessment(true)}>+ Add Assessment</button>
          </div>

          {/* Table */}
          <div className="card" style={{ padding:0, overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
              <thead>
                <tr style={{ background:'var(--bg-surface)' }}>
                  <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'0.82rem', color:'var(--text-secondary)', borderBottom:'1px solid var(--border)', position:'sticky',left:0, background:'var(--bg-surface)', minWidth:160 }}>Student</th>
                  {currentClass.assessments.map(a=>(
                    <th key={a.id} style={{ padding:'12px 10px', textAlign:'center', fontSize:'0.8rem', color:'var(--text-secondary)', borderBottom:'1px solid var(--border)', minWidth:100 }}>
                      <div style={{ fontWeight:700 }}>{a.name}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{a.type} · /{a.outOf}</div>
                    </th>
                  ))}
                  <th style={{ padding:'12px 10px', textAlign:'center', fontSize:'0.82rem', color:'var(--secondary)', borderBottom:'1px solid var(--border)', minWidth:90 }}>Average</th>
                  <th style={{ padding:'12px 10px', borderBottom:'1px solid var(--border)', width:40 }}></th>
                </tr>
              </thead>
              <tbody>
                {currentClass.students.length === 0 ? (
                  <tr><td colSpan={currentClass.assessments.length+3} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No students yet. Click "+ Add Student"</td></tr>
                ) : currentClass.students.map(s=>{
                  const avg = getAverage(s)
                  const avgNum = parseFloat(avg)
                  return (
                    <tr key={s.id} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'0.88rem', position:'sticky',left:0, background:'var(--bg-card)' }}>{s.name}</td>
                      {currentClass.assessments.map(a=>(
                        <td key={a.id} style={{ padding:'6px', textAlign:'center' }}>
                          <input type="number" min="0" max={a.outOf} value={s.marks[a.id] ?? ''} onChange={e=>updateMark(s.id,a.id,e.target.value)}
                            style={{ width:70, textAlign:'center', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'6px 4px', color:'var(--text)', fontSize:'0.88rem' }} />
                        </td>
                      ))}
                      <td style={{ textAlign:'center', padding:'8px', fontWeight:700, color: !isNaN(avgNum)?getColor(avgNum):'var(--text-muted)' }}>
                        {avg}{!isNaN(avgNum) && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Level {getSymbol(avgNum)}</div>}
                      </td>
                      <td style={{ textAlign:'center' }}><button onClick={()=>deleteStudent(s.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.85rem' }} title="Remove">🗑️</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="modal-overlay" onClick={()=>setShowAddClass(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">📊 New Class</h3><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddClass(false)}>✕</button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Class Name *</label><input className="form-input" placeholder="e.g. 9A Mathematics, Grade 10 Science" value={newClass.name} onChange={e=>setNewClass(f=>({...f,name:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="Subject name" value={newClass.subject} onChange={e=>setNewClass(f=>({...f,subject:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Grade</label><select className="form-select" value={newClass.grade} onChange={e=>setNewClass(f=>({...f,grade:e.target.value}))}><option value="">Select…</option>{GRADES_LIST.map(g=><option key={g}>{g}</option>)}</select></div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={addClass}>Create Class</button>
                <button className="btn btn-ghost" onClick={()=>setShowAddClass(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Assessment Modal */}
      {showAddAssessment && (
        <div className="modal-overlay" onClick={()=>setShowAddAssessment(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">📝 New Assessment</h3><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddAssessment(false)}>✕</button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Assessment Name *</label><input className="form-input" placeholder="e.g. Term 1 Test, Assignment 2" value={newAssessment.name} onChange={e=>setNewAssessment(f=>({...f,name:e.target.value}))} /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Out of (marks)</label><input className="form-input" type="number" min="1" value={newAssessment.outOf} onChange={e=>setNewAssessment(f=>({...f,outOf:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={newAssessment.type} onChange={e=>setNewAssessment(f=>({...f,type:e.target.value}))}>{['Test','Exam','Assignment','Project','Practical','Oral','Other'].map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={newAssessment.date} onChange={e=>setNewAssessment(f=>({...f,date:e.target.value}))} /></div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={addAssessment}>Add Assessment</button>
                <button className="btn btn-ghost" onClick={()=>setShowAddAssessment(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
