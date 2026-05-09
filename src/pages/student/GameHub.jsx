import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../../lib/gameCatalog'
import { getRecommendedGameSession } from '../../lib/adaptivePlanner'
import '../../styles/kids-theme.css'

export default function GameHub() {
  const navigate = useNavigate()
  const games = useMemo(() => getGames(), [])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [recommendOnly, setRecommendOnly] = useState(false)

  const categories = ['All', ...new Set(games.map((game) => game.category))]
  const gradeOptions = ['All', ...Array.from({ length: 12 }, (_, index) => String(index + 1))]
  const modeOptions = ['All', 'Practice', 'Sprint', 'Mastery']

  const enrichedGames = useMemo(
    () => games.map((game) => ({ ...game, adaptiveSession: getRecommendedGameSession(game) })),
    [games]
  )

  const filteredGames = enrichedGames
    .filter((game) => {
      const matchesCategory = category === 'All' || game.category === category
      const searchText = `${game.title} ${game.description} ${game.skills.join(' ')} ${(game.modes || []).join(' ')}`.toLowerCase()
      const matchesQuery = searchText.includes(query.trim().toLowerCase())
      const matchesGrade =
        gradeFilter === 'All' ||
        !Array.isArray(game.gradeRange) ||
        (Number(gradeFilter) >= game.gradeRange[0] && Number(gradeFilter) <= game.gradeRange[1])
      const matchesMode = modeFilter === 'All' || (game.modes || []).includes(modeFilter)
      const recommendedLevel = game.adaptiveSession.recommendedLevel
      const matchesRecommendation = !recommendOnly || recommendedLevel !== 'Support' || game.subjectKey !== 'arcade'
      return matchesCategory && matchesQuery && matchesGrade && matchesMode && matchesRecommendation
    })
    .sort((a, b) => {
      const masteryGap = b.adaptiveSession.state.mastery - a.adaptiveSession.state.mastery
      if (recommendOnly) return masteryGap
      if (a.adaptiveSession.recommendedLevel === b.adaptiveSession.recommendedLevel) return a.title.localeCompare(b.title)
      return a.adaptiveSession.recommendedLevel.localeCompare(b.adaptiveSession.recommendedLevel)
    })

  const recommendedCount = enrichedGames.filter((game) => game.adaptiveSession.state.attempts > 0).length

  return (
    <div className="page-wrapper animate-fade kids-theme">
      <div className="page-header">
        <div>
          <h1 className="page-title">Game Lab</h1>
          <p className="page-subtitle">Play richer browser games with better goals, progression, and skills-based variety.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/student')}>
          Back To Student Hub
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Playable Games', value: games.length, icon: '🎮', color: '#38bdf8' },
          { label: 'Skill Categories', value: categories.length - 1, icon: '🧠', color: '#8b5cf6' },
          { label: 'Adaptive Profiles', value: recommendedCount, icon: '📈', color: '#f97316' },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</div>
            <div className="stat-value" style={{ color: item.color }}>{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            className="form-input"
            style={{ minWidth: 260, flex: '1 1 320px' }}
            placeholder="Search by title, description, or skill..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="form-select" value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)} style={{ minWidth: 130 }}>
            {gradeOptions.map((item) => <option key={item} value={item}>{item === 'All' ? 'All Grades' : `Grade ${item}`}</option>)}
          </select>
          <select className="form-select" value={modeFilter} onChange={(event) => setModeFilter(event.target.value)} style={{ minWidth: 130 }}>
            {modeOptions.map((item) => <option key={item} value={item}>{item === 'All' ? 'All Modes' : item}</option>)}
          </select>
          <button className={`btn btn-sm ${recommendOnly ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRecommendOnly((prev) => !prev)}>
            {recommendOnly ? 'Showing Recommended' : 'Recommended First'}
          </button>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((item) => (
              <button
                key={item}
                className={`btn btn-sm ${category === item ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="card"
            style={{
              borderTop: `4px solid ${game.accent}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{game.icon}</div>
                <h3 style={{ margin: 0 }}>{game.title}</h3>
                <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {Array.isArray(game.gradeRange) ? `Grade ${game.gradeRange[0]}-${game.gradeRange[1]}` : 'All grades'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span className="badge badge-secondary">{game.category}</span>
                <span className="badge" style={{ background: `${game.accent}22`, color: game.accent }}>
                  {game.difficulty}
                </span>
                <span className="badge badge-secondary">
                  Level: {game.adaptiveSession.recommendedLevel}
                </span>
              </div>
            </div>

            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{game.description}</p>

            <div className="card-glass" style={{ padding: 14 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>Objective</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{game.objective}</div>
              <div style={{ fontSize: '0.82rem', marginTop: 8 }}>
                Recommended Mode: <strong>{game.adaptiveSession.recommendedMode}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {game.adaptiveSession.challenge}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {game.skills.map((skill) => (
                <span key={skill} className="badge badge-secondary">{skill}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(game.modes || []).map((mode) => (
                <span key={mode} className="badge" style={{ background: '#ffffff', color: 'var(--kids-ink)', border: '2px solid #d1d5db' }}>
                  {mode}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/game/${game.id}?level=${game.adaptiveSession.recommendedLevel.toLowerCase()}&sessionMode=${game.adaptiveSession.recommendedMode.toLowerCase()}`)}
              >
                Play Now
              </button>
              <button className="btn btn-secondary" onClick={() => window.open(game.path, '_blank', 'noopener,noreferrer')}>
                Open Standalone
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
          <h3>No games match that search</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try a different category or clear the search text.</p>
        </div>
      )}
    </div>
  )
}
