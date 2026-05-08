import { useParams, useNavigate } from 'react-router-dom'

const GAMES = {
  'fluffy-jump': { title: 'Fluffy Jump', path: '/teachers-pet/fluffy-jump/index.html', icon: '☁️' },
  'word-quest': { title: 'Word Quest', path: '/teachers-pet/word-quest/index.html', icon: '📝' },
  'snake-game': { title: 'Snake Game', path: '/teachers-pet/snake-game/index.html', icon: '🐍' },
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
    <div className="page-wrapper animate-fade" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student')}>Back</button>
          <h1 className="page-title">{game.icon} {game.title}</h1>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', background: '#000', position: 'relative' }}>
        <iframe 
          src={game.path} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          title={game.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
        Tip: If the game doesn't load, make sure you ran the <code>copy_games.bat</code> script.
      </p>
    </div>
  )
}
