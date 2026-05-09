import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../../lib/gameCatalog'
import { getRecommendedGameSession } from '../../lib/adaptivePlanner'
import '../../styles/kids-theme.css'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ streak: 5, coins: 120, assignments: 3, progress: 65 })
  const featuredGames = useMemo(
    () => getGames()
      .map((game) => ({ ...game, adaptive: getRecommendedGameSession(game) }))
      .sort((a, b) => b.adaptive.state.mastery - a.adaptive.state.mastery)
      .slice(0, 4),
    []
  )
  const learnerTools = [
    { title: 'Student Portal', icon: '🎓', path: '/student-portal', desc: 'Guides, flashcards, and notes' },
    { title: 'AI Study Lab', icon: '🔬', path: '/study-lab', desc: 'Quizzes, summaries, doc chat' },
    { title: 'Auto-Organizer', icon: '📂', path: '/auto-organizer', desc: 'Organise docs and deadlines' },
    { title: 'Opportunities', icon: '🌍', path: '/opportunities', desc: 'Bursaries and careers' },
  ]

  return (
    <div className="page-wrapper animate-fade kids-theme">
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
              { label: 'Game Lab', icon: '🎮', path: '/games', desc: 'Play & practise' },
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

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0 }}>Learner Toolkit</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>Support for different grades, subjects, and learning styles.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {learnerTools.map((tool) => (
            <button
              key={tool.title}
              className="card-glass"
              onClick={() => navigate(tool.path)}
              style={{ textAlign: 'left', padding: 16, cursor: 'pointer', border: '1px solid var(--border)' }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{tool.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{tool.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tool.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0 }}>Featured Game Picks</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>Fresh games with stronger mechanics and clearer learning goals.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/games')}>
            Open Game Lab
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {featuredGames.map((game) => (
            <button
              key={game.id}
              className="card-glass"
              onClick={() => navigate(`/game/${game.id}?level=${game.adaptive.recommendedLevel.toLowerCase()}&sessionMode=${game.adaptive.recommendedMode.toLowerCase()}`)}
              style={{
                textAlign: 'left',
                padding: 16,
                cursor: 'pointer',
                border: `1px solid ${game.accent}44`,
                borderTop: `3px solid ${game.accent}`,
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{game.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{game.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{game.description}</div>
              <div style={{ fontSize: '0.72rem', marginTop: 6 }}>Level: {game.adaptive.recommendedLevel} · Mode: {game.adaptive.recommendedMode}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
