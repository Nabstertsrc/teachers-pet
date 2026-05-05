import { useState, useEffect } from 'react'
import { getGradebook, getAttendance, saveAttendance } from '../lib/storage'
import { useToast } from '../context/AppContext'

export default function Attendance() {
  const toast = useToast()
  const [gb, setGb] = useState({ classes: [] })
  const [activeClass, setActiveClass] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [currentMap, setCurrentMap] = useState({})

  useEffect(() => {
    const load = async () => {
      const [gData, aData] = await Promise.all([getGradebook(), getAttendance()])
      setGb(gData)
      setRecords(aData)
      if (gData.classes?.length > 0) setActiveClass(gData.classes[0].id)
    }
    load()
  }, [])

  const currentClass = gb.classes?.find(c => c.id === activeClass)

  useEffect(() => {
    if (activeClass && date) {
      const existing = records.find(r => r.classId === activeClass && r.date === date)
      if (existing) {
        setCurrentMap(existing.statusMap)
      } else {
        // Default all to present
        const initial = {}
        currentClass?.students.forEach(s => initial[s.id] = 'P')
        setCurrentMap(initial)
      }
    }
  }, [activeClass, date, records, currentClass])

  const setStatus = (studentId, status) => {
    setCurrentMap(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    const newRecord = { classId: activeClass, date, statusMap: currentMap, id: Date.now().toString() }
    const updated = records.filter(r => !(r.classId === activeClass && r.date === date))
    updated.push(newRecord)
    setRecords(updated)
    await saveAttendance(updated)
    toast('Attendance saved! ✅', 'success')
  }

  const getStats = () => {
    const vals = Object.values(currentMap)
    const present = vals.filter(v => v === 'P').length
    const absent = vals.filter(v => v === 'A').length
    const late = vals.filter(v => v === 'L').length
    return { present, absent, late, total: vals.length }
  }

  const stats = getStats()

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📝 Attendance Tracker</h1><p className="page-subtitle">Daily register for your classes</p></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={!activeClass}>💾 Save Register</button>
      </div>

      {gb.classes?.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📝</div><h3>No classes found</h3><p>Create a class in the Gradebook first</p></div>
      ) : (
        <>
          <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
            <div className="form-group" style={{ flex:1, minWidth:200 }}>
              <label className="form-label">Select Class</label>
              <select className="form-select" value={activeClass} onChange={e => setActiveClass(e.target.value)}>
                {gb.classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div className="grid-4" style={{ marginBottom:20 }}>
            <div className="stat-card" style={{ borderLeft:'4px solid var(--success)' }}><div className="stat-value" style={{ color:'var(--success)' }}>{stats.present}</div><div className="stat-label">Present</div></div>
            <div className="stat-card" style={{ borderLeft:'4px solid var(--accent)' }}><div className="stat-value" style={{ color:'var(--accent)' }}>{stats.absent}</div><div className="stat-label">Absent</div></div>
            <div className="stat-card" style={{ borderLeft:'4px solid var(--warning)' }}><div className="stat-value" style={{ color:'var(--warning)' }}>{stats.late}</div><div className="stat-label">Late</div></div>
            <div className="stat-card" style={{ borderLeft:'4px solid var(--primary)' }}><div className="stat-value">{Math.round((stats.present/stats.total)*100 || 0)}%</div><div className="stat-label">Attendance Rate</div></div>
          </div>

          <div className="card" style={{ padding:0 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg-surface)' }}>
                  <th style={{ padding:'12px 16px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>Student Name</th>
                  <th style={{ padding:'12px 16px', textAlign:'center', borderBottom:'1px solid var(--border)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentClass?.students.map(s => (
                  <tr key={s.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'12px 16px', fontWeight:500 }}>{s.name}</td>
                    <td style={{ padding:'12px 16px', textAlign:'center' }}>
                      <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                        {['P','A','L'].map(st => (
                          <button key={st} onClick={() => setStatus(s.id, st)} className={`btn btn-sm ${currentMap[s.id] === st ? (st==='P'?'btn-success':st==='A'?'btn-danger':'btn-warning') : 'btn-ghost'}`} style={{ width:36 }}>
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
