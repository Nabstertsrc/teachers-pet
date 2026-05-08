import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/AppContext'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ streak: 5, coins: 120, assignments: 3, progress: 65 })

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">👋 Welcome back, Scholar!</h1>
          <p className="page-subtitle">Ready to continue your learning journey?</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Study Streak', value: `${stats.streak} Days`, icon: '🔥', color: '#FF6B6B' },
          { label: 'Study Coins', value: stats.coins, icon: '🪙', color: '#FFB347' },
          { label: 'Due Soon', value: stats.assignments, icon: '📋', color: '#6C63FF' },
          { label: 'Avg Progress', value: `${stats.progress}%`, icon: '📈', color: '#00D9C4' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>🚀 Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'AI Study Lab', icon: '🔬', path: '/study-lab', desc: 'Notes & Guides' },
              { label: 'Assignments', icon: '📋', path: '/assignments', desc: 'Tasks to do' },
              { label: 'Learning Path', icon: '🗺️', path: '/learning-path', desc: 'Next steps' },
              { label: 'Resources', icon: '📖', path: '/resources', desc: 'Library' },
            ].map((a, i) => (
              <button key={i} className="card-glass" onClick={() => navigate(a.path)} style={{ textAlign: 'left', padding: 16, cursor: 'pointer', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>📅 Coming Up</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Maths Assignment', due: 'Tomorrow', type: 'Work' },
              { title: 'Science Project', due: 'In 3 days', type: 'Project' },
              { title: 'History Quiz', due: 'Friday', type: 'Test' },
            ].map((item, i) => (
              <div key={i} className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {item.due}</div>
                </div>
                <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
