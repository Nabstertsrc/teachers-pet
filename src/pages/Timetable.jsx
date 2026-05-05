import { useState } from 'react'
import { getTimetable, saveTimetable } from '../lib/storage'
import { useToast } from '../context/AppContext'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday']
const PERIODS = ['07:00–07:45','07:45–08:30','08:30–09:15','09:15–10:00','10:00–10:20 (Break)','10:20–11:05','11:05–11:50','11:50–12:35','12:35–13:05 (Lunch)','13:05–13:50','13:50–14:35']
const COLORS = ['#6C63FF','#00D9C4','#FF6B6B','#FFB347','#4ECDC4','#64B5F6','#A78BFA','#F472B6','#34D399','#FBBF24']
const SUBJECTS_LIST = ['Mathematics','English','Afrikaans','Natural Sciences','Life Sciences','Physical Sciences','Geography','History','Life Orientation','Technology','Economics','Business Studies','Accounting','Free Period','Assembly','Other']

export default function Timetable() {
  const toast = useToast()
  const [timetable, setTimetable] = useState(() => getTimetable())
  const [editing, setEditing] = useState(null) // { day, period }
  const [editForm, setEditForm] = useState({ subject:'', teacher:'', room:'', color: COLORS[0] })

  const getCell = (day, period) => timetable[`${day}_${period}`] || null

  const openEdit = (day, period) => {
    const cell = getCell(day, period)
    setEditForm(cell ? { ...cell } : { subject:'', teacher:'', room:'', color: COLORS[0] })
    setEditing({ day, period })
  }

  const saveCell = () => {
    const key = `${editing.day}_${editing.period}`
    const updated = editForm.subject ? { ...timetable, [key]: editForm } : (({ [key]: _, ...rest }) => rest)(timetable)
    setTimetable(updated); saveTimetable(updated)
    setEditing(null); toast('Timetable updated!', 'success')
  }

  const clearCell = () => {
    const key = `${editing.day}_${editing.period}`
    const { [key]: _, ...rest } = timetable
    setTimetable(rest); saveTimetable(rest)
    setEditing(null); toast('Cell cleared', 'info')
  }

  const isBreak = (period) => period.includes('Break') || period.includes('Lunch')

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">🗓️ Timetable Manager</h1><p className="page-subtitle">Click any period to assign a subject</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary" onClick={()=>{setTimetable({});saveTimetable({});toast('Timetable cleared','info')}}>🗑️ Clear All</button>
          <button className="btn btn-success" onClick={()=>window.print()}>🖨️ Print</button>
        </div>
      </div>

      <div style={{ overflowX:'auto' }}>
        <table className="timetable-table">
          <thead>
            <tr>
              <th style={{ width:160 }}>Period</th>
              {DAYS.map(d=><th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map(period=>(
              <tr key={period} className={isBreak(period)?'break-row':''}>
                <td className="period-label">{period}</td>
                {DAYS.map(day=>{
                  const cell = getCell(day, period)
                  return (
                    <td key={day} className={`timetable-cell ${isBreak(period)?'break-cell':''}`} onClick={()=>!isBreak(period)&&openEdit(day,period)}>
                      {cell ? (
                        <div className="cell-content" style={{ background: cell.color+'22', borderLeft:`3px solid ${cell.color}` }}>
                          <div style={{ fontWeight:700, fontSize:'0.85rem', color: cell.color }}>{cell.subject}</div>
                          {cell.teacher && <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{cell.teacher}</div>}
                          {cell.room && <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>📍 {cell.room}</div>}
                        </div>
                      ) : isBreak(period) ? (
                        <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.8rem', fontStyle:'italic' }}>—</div>
                      ) : (
                        <div className="cell-empty">+ Add</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={()=>setEditing(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📅 {editing.day} — {editing.period}</h3>
              <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(null)}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Subject</label><select className="form-select" value={editForm.subject} onChange={e=>setEditForm(f=>({...f,subject:e.target.value}))}><option value="">Select subject…</option>{SUBJECTS_LIST.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Teacher (optional)</label><input className="form-input" placeholder="Teacher name" value={editForm.teacher} onChange={e=>setEditForm(f=>({...f,teacher:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Room / Venue (optional)</label><input className="form-input" placeholder="e.g. Room 14, Lab A" value={editForm.room} onChange={e=>setEditForm(f=>({...f,room:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Colour</label><div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {COLORS.map(c=><button key={c} onClick={()=>setEditForm(f=>({...f,color:c}))} style={{ width:32, height:32, borderRadius:'50%', background:c, border: editForm.color===c?'3px solid #fff':'2px solid transparent', cursor:'pointer', transition:'all 0.15s' }} />)}
              </div></div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={saveCell}>💾 Save</button>
                {getCell(editing.day, editing.period) && <button className="btn btn-danger" onClick={clearCell}>🗑️ Clear</button>}
                <button className="btn btn-ghost" onClick={()=>setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .timetable-table { width:100%; border-collapse:collapse; min-width:700px; }
        .timetable-table th { background:var(--bg-surface); padding:12px 10px; font-size:0.85rem; font-weight:700; color:var(--text-secondary); border:1px solid var(--border); text-align:center; }
        .timetable-table td { border:1px solid var(--border); padding:0; height:72px; }
        .period-label { padding:10px 14px; font-size:0.78rem; color:var(--text-muted); background:var(--bg-surface); width:160px; white-space:nowrap; }
        .timetable-cell { cursor:pointer; transition:background var(--transition); }
        .timetable-cell:hover { background:var(--bg-hover); }
        .break-row td { background:rgba(255,179,71,0.05); height:36px; }
        .break-cell { cursor:default !important; }
        .cell-content { height:100%; padding:8px 10px; display:flex; flex-direction:column; justify-content:center; gap:2px; }
        .cell-empty { height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:0.78rem; opacity:0; transition:opacity var(--transition); }
        .timetable-cell:hover .cell-empty { opacity:1; }
        @media print { .sidebar,.voice-bar,.page-header .btn { display:none!important; } }
      `}</style>
    </div>
  )
}
