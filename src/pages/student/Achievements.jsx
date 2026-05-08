import { useState } from 'react'

export default function Achievements() {
  const [stats, setStats] = useState({ level: 4, xp: 1250, nextXp: 2000 })
  const [badges, setBadges] = useState([
    { id: 1, title: 'Early Bird', desc: 'Finish an assignment 2 days early', icon: '🌅', unlocked: true },
    { id: 2, title: 'Quiz Whiz', desc: 'Get 100% on an AI Quiz', icon: '🧠', unlocked: true },
    { id: 3, title: 'Note Taker', desc: 'Generate 10 Study Guides', icon: '📚', unlocked: true },
    { id: 4, title: 'Scholar', desc: 'Study for 7 days in a row', icon: '🎓', unlocked: false },
    { id: 5, title: 'Organized', desc: 'Auto-organize 20 documents', icon: '📂', unlocked: false },
  ])

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏆 Achievements & Level</h1>
          <p className="page-subtitle">Track your learning progress and unlock rewards</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 28, background: 'linear-gradient(135deg, var(--primary) 0%, #6C63FF 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Current Level</div>
            <div style={{ fontSize: '3rem', fontWeight: 900 }}>{stats.level}</div>
          </div>
          <div style={{ flex: 1, margin: '0 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
              <span>XP: {stats.xp} / {stats.nextXp}</span>
              <span>{Math.round((stats.xp / stats.nextXp) * 100)}%</span>
            </div>
            <div style={{ height: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(stats.xp / stats.nextXp) * 100}%`, background: 'white' }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem' }}>🌟</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Master</div>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 20 }}>Unlocked Badges</h3>
      <div className="grid-3">
        {badges.map(badge => (
          <div key={badge.id} className={`card ${badge.unlocked ? '' : 'locked'}`} style={{ 
            opacity: badge.unlocked ? 1 : 0.5,
            filter: badge.unlocked ? 'none' : 'grayscale(1)',
            textAlign: 'center',
            padding: 30
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>{badge.icon}</div>
            <h4 style={{ marginBottom: 8 }}>{badge.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{badge.desc}</p>
            {!badge.unlocked && <div style={{ marginTop: 12, fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)' }}>LOCKED</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
