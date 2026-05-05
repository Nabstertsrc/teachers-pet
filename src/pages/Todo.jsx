import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getTodos, saveTodos, addTodo } from '../lib/storage'
import { useToast } from '../context/AppContext'

const PRIORITIES = ['low','medium','high']
const CATEGORIES = ['Marking','Planning','Admin','Meeting','Communication','Personal','Other']

export default function Todo() {
  const location = useLocation()
  const toast = useToast()
  const prefill = location.state?.prefill || {}
  const [todos, setTodos] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: prefill.title||'', dueDate:'', priority:'medium', category:'Planning', notes:'' })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await getTodos()
      setTodos(data)
    }
    load()
  }, [])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleAdd = async () => {
    if (!form.title.trim()) { toast('Enter a task title', 'warning'); return }
    await addTodo(form)
    const updated = await getTodos()
    setTodos(updated); setShowAdd(false)
    setForm({ title:'', dueDate:'', priority:'medium', category:'Planning', notes:'' })
    toast('Task added!', 'success')
  }

  const toggleComplete = async (id) => {
    const updated = todos.map(t => t.id===id ? {...t, completed:!t.completed} : t)
    await saveTodos(updated)
    const refreshed = await getTodos()
    setTodos(refreshed)
  }

  const deleteTodo = async (id) => { 
    await saveTodos(todos.filter(t=>t.id!==id))
    const updated = await getTodos()
    setTodos(updated); toast('Task removed','info') 
  }

  const isOverdue = (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()

  const filtered = todos.filter(t => {
    if (filter==='active' && t.completed) return false
    if (filter==='completed' && !t.completed) return false
    if (filter==='overdue' && !isOverdue(t)) return false
    return `${t.title} ${t.category} ${t.notes}`.toLowerCase().includes(search.toLowerCase())
  }).sort((a,b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const p = {high:0,medium:1,low:2}; return (p[a.priority]||1)-(p[b.priority]||1)
  })

  const counts = { all:todos.length, active:todos.filter(t=>!t.completed).length, completed:todos.filter(t=>t.completed).length, overdue:todos.filter(isOverdue).length }
  const priorityColor = { high:'var(--accent)', medium:'var(--warning)', low:'var(--success)' }
  const categoryEmoji = { Marking:'✏️', Planning:'📅', Admin:'📋', Meeting:'👥', Communication:'📧', Personal:'👤', Other:'📌' }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">✅ To-Do & Reminders</h1><p className="page-subtitle">Stay on top of your teaching tasks</p></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Task</button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom:16 }}>
        {[['all','All'],['active','Active'],['completed','Done'],['overdue','Overdue']].map(([v,l])=>(
          <button key={v} className={`tab ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>
            {l} <span style={{ marginLeft:4, fontSize:'0.75rem', opacity:0.8 }}>({counts[v]})</span>
          </button>
        ))}
      </div>

      <div className="search-bar" style={{ marginBottom:20 }}><span>🔍</span><input placeholder="Search tasks…" value={search} onChange={e=>setSearch(e.target.value)} /></div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>{filter==='completed'?'No completed tasks':filter==='overdue'?'No overdue tasks!':'All clear!'}</h3>
          <p>You're all caught up 🎉</p>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Task</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(t=>(
            <div key={t.id} className="card" style={{ padding:'16px 20px', display:'flex', gap:14, alignItems:'flex-start', opacity: t.completed?0.6:1, borderLeft:`4px solid ${isOverdue(t)?'var(--accent)':priorityColor[t.priority]}` }}>
              <input type="checkbox" checked={t.completed} onChange={()=>toggleComplete(t.id)} style={{ width:18,height:18,marginTop:3,cursor:'pointer',accentColor:'var(--primary)',flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:600, fontSize:'0.95rem', textDecoration:t.completed?'line-through':'none', color:t.completed?'var(--text-muted)':'var(--text)' }}>{t.title}</span>
                  {isOverdue(t) && <span className="badge badge-danger" style={{ fontSize:'0.7rem' }}>⚠️ Overdue</span>}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:6, flexWrap:'wrap', alignItems:'center' }}>
                  {t.category && <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{categoryEmoji[t.category]||'📌'} {t.category}</span>}
                  {t.dueDate && <span style={{ fontSize:'0.78rem', color: isOverdue(t)?'var(--accent)':'var(--text-muted)' }}>📅 {new Date(t.dueDate).toLocaleDateString()}</span>}
                  <span className={`badge ${t.priority==='high'?'badge-danger':t.priority==='medium'?'badge-warning':'badge-success'}`} style={{ fontSize:'0.7rem' }}>{t.priority}</span>
                </div>
                {t.notes && <p style={{ marginTop:6, fontSize:'0.82rem', color:'var(--text-muted)' }}>{t.notes}</p>}
              </div>
              <button onClick={()=>deleteTodo(t.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.9rem',flexShrink:0 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {todos.length > 0 && (
        <div className="card" style={{ marginTop:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>Overall Progress</span>
            <span style={{ fontWeight:700, color:'var(--primary)' }}>{Math.round((counts.completed/counts.all)*100)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width:`${(counts.completed/counts.all)*100}%` }} /></div>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:8 }}>{counts.completed} of {counts.all} tasks completed</p>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">✅ New Task</h3><button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>✕</button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Task Title *</label><input className="form-input" placeholder="What do you need to do?" value={form.title} onChange={e=>set('title',e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()} autoFocus /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.dueDate} onChange={e=>set('dueDate',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={e=>set('priority',e.target.value)}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" rows={2} placeholder="Additional notes…" value={form.notes} onChange={e=>set('notes',e.target.value)} /></div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={handleAdd}>Add Task</button>
                <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
