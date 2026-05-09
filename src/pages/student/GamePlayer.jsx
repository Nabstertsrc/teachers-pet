import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getGameById, getGames } from '../../lib/gameCatalog'
import { getRecommendedGameSession, recordGameResult } from '../../lib/adaptivePlanner'
import '../../styles/kids-theme.css'

export default function GamePlayer() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const game = getGameById(gameId)
  const adaptiveSession = useMemo(() => (game ? getRecommendedGameSession(game) : null), [game])
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || adaptiveSession?.recommendedLevel?.toLowerCase() || 'core')
  const [selectedMode, setSelectedMode] = useState(searchParams.get('sessionMode') || adaptiveSession?.recommendedMode?.toLowerCase() || 'practice')
  const [sessionTick, setSessionTick] = useState(0)
  const otherGames = useMemo(
    () => getGames()
      .filter((item) => item.id !== gameId)
      .map((item) => ({ ...item, adaptive: getRecommendedGameSession(item) }))
      .sort((a, b) => b.adaptive.state.mastery - a.adaptive.state.mastery)
      .slice(0, 4),
    [gameId, sessionTick]
  )

  useEffect(() => {
    if (!adaptiveSession) return
    const nextLevel = searchParams.get('level') || adaptiveSession.recommendedLevel.toLowerCase()
    const nextMode = searchParams.get('sessionMode') || adaptiveSession.recommendedMode.toLowerCase()
    setSelectedLevel(nextLevel)
    setSelectedMode(nextMode)
  }, [adaptiveSession, searchParams])

  if (!game) {
    return (
      <div className="page-wrapper animate-fade kids-theme">
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <h1>🎮 Game Not Found</h1>
          <button className="btn btn-primary" onClick={() => navigate('/games')}>Open Game Lab</button>
        </div>
      </div>
    )
  }

  const iframeSrc = `${game.path}${game.path.includes('?') ? '&' : '?'}level=${selectedLevel}&mode=${selectedMode}`
  const modeDescription = {
    practice: 'Guided pacing with room to build confidence.',
    sprint: 'Faster rounds and stronger speed pressure.',
    mastery: 'Higher challenge with fewer second chances.',
  }
  const levelDescription = {
    support: 'Best for scaffolding, hints, and steady wins.',
    core: 'Balanced difficulty for everyday practice.',
    advanced: 'Stretch level for confident learners.',
  }

  function updateSession(nextLevel, nextMode = selectedMode) {
    setSelectedLevel(nextLevel)
    setSelectedMode(nextMode)
    setSearchParams({ level: nextLevel, sessionMode: nextMode }, { replace: true })
  }

  function updateMode(nextMode) {
    setSelectedMode(nextMode)
    setSearchParams({ level: selectedLevel, sessionMode: nextMode }, { replace: true })
  }

  function recordOutcome(outcome) {
    recordGameResult(game.id, outcome, selectedMode)
    setSessionTick((value) => value + 1)
  }

  return (
    <div className="game-fullscreen-container animate-fade kids-theme">
      <aside className="game-side-panel">
        <div className="game-panel-top">
          <div className="game-title-wrap">
            <div className="game-icon">{game.icon}</div>
            <div>
              <h1>{game.title}</h1>
              <p>{game.description}</p>
            </div>
          </div>

          <div className="game-meta-row">
            <span className="game-title-pill" style={{ background: `${game.accent}22`, color: game.accent }}>
              {game.category}
            </span>
            <span className="game-title-pill">{game.difficulty}</span>
          </div>
        </div>

        <div className="game-panel-block">
          <h3>Objective</h3>
          <p>{game.objective}</p>
        </div>

        <div className="game-panel-block">
          <h3>Controls</h3>
          <p>{game.controls}</p>
        </div>

        <div className="game-panel-block">
          <h3>Skill Focus</h3>
          <div className="game-skill-list">
            {game.skills.map((skill) => (
              <span key={skill} className="game-skill-pill">{skill}</span>
            ))}
          </div>
        </div>

        <div className="game-panel-block">
          <h3>Adaptive Session</h3>
          <p>
            Recommended: <strong>{adaptiveSession.recommendedLevel}</strong> level in <strong>{adaptiveSession.recommendedMode}</strong> mode.
          </p>
          <p style={{ marginTop: 6 }}>{adaptiveSession.challenge}</p>
          <div className="session-picker">
            {(game.levels || ['Support', 'Core', 'Advanced']).map((level) => (
              <button
                key={level}
                className={`session-pill ${selectedLevel === level.toLowerCase() ? 'active' : ''}`}
                onClick={() => updateSession(level.toLowerCase())}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="session-picker" style={{ marginTop: 8 }}>
            {(game.modes || ['Practice']).map((mode) => (
              <button
                key={mode}
                className={`session-pill ${selectedMode === mode.toLowerCase() ? 'active' : ''}`}
                onClick={() => updateMode(mode.toLowerCase())}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="card-glass" style={{ padding: 12, marginTop: 10 }}>
            <div style={{ fontWeight: 700 }}>Current Setup</div>
            <div style={{ fontSize: '0.86rem', marginTop: 4 }}>{levelDescription[selectedLevel]}</div>
            <div style={{ fontSize: '0.86rem', marginTop: 4 }}>{modeDescription[selectedMode]}</div>
            <div style={{ fontSize: '0.82rem', marginTop: 8, color: 'var(--text-muted)' }}>
              Attempts logged: {adaptiveSession.state.attempts} | Mastery: {adaptiveSession.state.mastery}%
            </div>
          </div>
          <div className="feedback-actions">
            <button className="btn btn-primary btn-sm" onClick={() => recordOutcome('solved')}>I Solved It</button>
            <button className="btn btn-secondary btn-sm" onClick={() => recordOutcome('support')}>Need Support</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { recordOutcome('solved'); updateSession('advanced', 'mastery') }}>Too Easy</button>
          </div>
        </div>

        <div className="game-panel-actions">
          <button className="btn btn-primary" onClick={() => navigate('/games')}>
            Browse Game Lab
          </button>
          <button className="btn btn-secondary" onClick={() => window.open(game.path, '_blank', 'noopener,noreferrer')}>
            Open Standalone
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/student')}>
            Back To Student Hub
          </button>
        </div>

        <div className="game-panel-block">
          <h3>Try Next</h3>
          <div className="game-recommendations">
            {otherGames.map((item) => (
              <button
                key={item.id}
                className="game-reco-card"
                onClick={() => navigate(`/game/${item.id}?level=${item.adaptive.recommendedLevel.toLowerCase()}&sessionMode=${item.adaptive.recommendedMode.toLowerCase()}`)}
              >
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.category} · {item.adaptive.recommendedLevel}</small>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="game-frame-shell">
        <iframe
          src={iframeSrc}
          className="game-iframe"
          title={game.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </main>

      <style>{`
        .game-fullscreen-container {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: linear-gradient(135deg, #E1F5FE, #81D4FA 50%, #4FC3F7);
          display: flex;
          gap: 20px;
          padding: 20px;
        }

        .game-side-panel {
          width: 360px;
          max-width: 32vw;
          background: #FFFFFF;
          border: 4px solid #E0E0E0;
          border-radius: 30px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow-y: auto;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .game-panel-top h1 {
          margin: 0 0 6px;
          font-size: 2rem;
          color: #333;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-panel-top p,
        .game-panel-block p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-weight: 500;
        }

        .game-title-wrap {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .game-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: #F5F5F5;
          font-size: 2.2rem;
          flex-shrink: 0;
          border: 3px solid #EEE;
        }

        .game-meta-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .game-panel-block h3 {
          margin: 0 0 8px;
          color: #FF5252;
          font-size: 1.1rem;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-panel-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .session-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .session-pill {
          background: #f8fafc;
          border: 2px solid #cbd5e1;
          border-radius: 999px;
          padding: 7px 12px;
          color: #0f172a;
          font-weight: 700;
        }
        .session-pill.active {
          background: #dbeafe;
          border-color: #60a5fa;
        }
        .feedback-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .game-title-pill {
          background: #F5F5F5;
          color: #333;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 2px solid #E0E0E0;
          display: inline-flex;
          align-items: center;
        }

        .game-skill-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .game-skill-pill {
          background: #E8F5E9;
          color: #2E7D32;
          border: 2px solid #81C784;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .game-recommendations {
          display: grid;
          gap: 10px;
        }

        .game-reco-card {
          background: #F5F5F5;
          border: 3px solid #E0E0E0;
          border-radius: 20px;
          padding: 14px;
          color: #333;
          text-align: left;
          display: grid;
          gap: 4px;
          cursor: pointer;
        }

        .game-reco-card:hover {
          background: #FFF;
          border-color: #4FC3F7;
        }

        .game-reco-card span {
          font-size: 1.5rem;
        }

        .game-reco-card strong {
          font-size: 1.05rem;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-reco-card small {
          color: #666;
          font-weight: 600;
        }

        .game-frame-shell {
          flex: 1;
          min-width: 0;
          border-radius: 30px;
          overflow: hidden;
          border: 4px solid #E0E0E0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          background: #020617;
        }

        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 1100px) {
          .game-fullscreen-container {
            flex-direction: column;
          }

          .game-side-panel {
            width: 100%;
            max-width: none;
            max-height: 42vh;
          }
          .feedback-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .game-fullscreen-container {
            padding: 12px;
            gap: 12px;
          }

          .game-side-panel {
            padding: 18px;
            border-radius: 18px;
          }

          .game-frame-shell {
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  )
}
