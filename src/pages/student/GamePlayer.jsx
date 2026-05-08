import { useParams, useNavigate } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL || '/'

const GAMES = {
  'fluffy-jump': { title: 'Fluffy Jump', path: `${BASE}fluffy-jump/index.html`, icon: '☁️' },
  'word-quest': { title: 'Word Quest', path: `${BASE}word-quest/index.html`, icon: '📝' },
  'snake-game': { title: 'Snake Game', path: `${BASE}snake-game/index.html`, icon: '🐍' },
}

export default function GamePlayer() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = GAMES[gameId]

  if (!game) {
    return (
      <div className="page-wrapper animate-fade">
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <h1>🎮 Game Not Found</h1>
          <button className="btn btn-primary" onClick={() => navigate('/student')}>Back to Student Hub</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-fullscreen-container animate-fade">
      <div className="game-overlay-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student')}>
          ⬅️ Back to Student Hub
        </button>
        <div className="game-title-pill">
          {game.icon} {game.title}
        </div>
      </div>

      <iframe 
        src={game.path} 
        className="game-iframe"
        title={game.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <style>{`
        .game-fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2000;
          background: #000;
          display: flex;
          flex-direction: column;
        }
        .game-overlay-header {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          z-index: 2001;
        }
        .game-overlay-header button {
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .game-title-pill {
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  )
}
