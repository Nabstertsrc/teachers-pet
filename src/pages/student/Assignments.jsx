import { useState, useEffect } from 'react'
import { useToast } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'

export default function Assignments() {
  const toast = useToast()
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Maths Exercise 4.2', subject: 'Mathematics', due: '2026-05-10', status: 'Pending' },
    { id: 2, title: 'English Essay', subject: 'English', due: '2026-05-12', status: 'Completed' },
    { id: 3, title: 'Science Lab Report', subject: 'Physical Science', due: '2026-05-15', status: 'Pending' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', subject: '', due: '' })

  const addTask = () => {
    if (!newTask.title) return
    const task = { id: Date.now(), ...newTask, status: 'Pending' }
    setTasks([task, ...tasks])
    setShowAdd(false)
    setNewTask({ title: '', subject: '', due: '' })
    toast('Task added! ✅', 'success')
  }

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t))
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Assignments & Tasks</h1>
          <p className="page-subtitle">Keep track of your school work and deadlines</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ New Task</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value">{tasks.filter(t=>t.status==='Pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tasks.filter(t=>t.status==='Completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {tasks.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found. Click "+ New Task" to start.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map(task => (
              <div key={task.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px 20px', 
                borderBottom: '1px solid var(--border)',
                opacity: task.status === 'Completed' ? 0.6 : 1
              }}>
                <input 
                  type="checkbox" 
                  checked={task.status === 'Completed'} 
                  onChange={() => toggleStatus(task.id)}
                  style={{ width: 20, height: 20, marginRight: 16, cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '1rem',
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {task.subject} • Due: {task.due}
                  </div>
                </div>
                <span className={`badge ${task.status === 'Completed' ? 'badge-primary' : 'badge-secondary'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">New Task</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input className="form-input" value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={newTask.subject} onChange={e=>setNewTask({...newTask, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={newTask.due} onChange={e=>setNewTask({...newTask, due: e.target.value})} />
              </div>
              <button className="btn btn-primary" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
