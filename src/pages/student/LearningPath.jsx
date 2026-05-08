import { useState } from 'react'

export default function LearningPath() {
  const [modules, setModules] = useState([
    { id: 1, title: 'Algebra Fundamentals', progress: 100, status: 'Completed' },
    { id: 2, title: 'Geometry & Shapes', progress: 45, status: 'In Progress' },
    { id: 3, title: 'Statistics 101', progress: 0, status: 'Locked' },
  ])

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🗺️ My Learning Path</h1>
          <p className="page-subtitle">Your step-by-step journey to mastering your subjects</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Current Progress</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {modules.map(mod => (
              <div key={mod.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{mod.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mod.progress}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${mod.progress}%`, background: 'var(--primary)', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ marginTop: 6, fontSize: '0.75rem', color: mod.status === 'Completed' ? 'var(--success)' : 'var(--text-muted)' }}>
                  {mod.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎯</div>
          <h3>Next Goal</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Complete 'Geometry' to unlock the next level of your learning journey.</p>
          <button className="btn btn-secondary">Continue Learning</button>
        </div>
      </div>
    </div>
  )
}
