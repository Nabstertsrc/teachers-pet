import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const GAMES = [
  { id: 'geo', title: 'Geometry Builder', icon: '📐', desc: 'Build shapes and calculate areas.' },
  { id: 'num', title: 'Number Quest', icon: '🔢', desc: 'Solve rapid-fire equations.' },
  { id: 'logic', title: 'Logic Gates', icon: '🔌', desc: 'Connect inputs to solve puzzles.' }
]

export default function MathsGames() {
  const toast = useToast()
  const [activeGame, setActiveGame] = useState(null)
  const [geoShape, setGeoShape] = useState({ type: 'square', size: 100 })

  return (
    <div className="maths-games-fullscreen animate-fade">
      <div className="lab-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span>
          <h2 style={{ margin: 0 }}>Maths Brain Games</h2>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => activeGame ? setActiveGame(null) : window.history.back()}>
          {activeGame ? 'Back to Games' : 'Exit Hub'}
        </button>
      </div>

      <div className="games-content">
        {!activeGame ? (
          <div className="game-selection">
            <h1>Choose Your Challenge</h1>
            <div className="game-grid">
              {GAMES.map(g => (
                <motion.div 
                  key={g.id} 
                  className="game-card" 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveGame(g.id)}
                >
                  <div className="game-icon">{g.icon}</div>
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                  <button className="btn btn-primary btn-sm">Start Game</button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="active-game-workspace">
            {activeGame === 'geo' && (
              <div className="geo-builder">
                <div className="sidebar-tools">
                  <h3>Shapes</h3>
                  <button className="btn btn-ghost" onClick={() => setGeoShape({ type: 'square', size: 100 })}>Square</button>
                  <button className="btn btn-ghost" onClick={() => setGeoShape({ type: 'circle', size: 100 })}>Circle</button>
                  <button className="btn btn-ghost" onClick={() => setGeoShape({ type: 'triangle', size: 100 })}>Triangle</button>
                  <div className="slider-group">
                    <label>Scale: {geoShape.size}px</label>
                    <input type="range" min="50" max="250" value={geoShape.size} onChange={e => setGeoShape({...geoShape, size: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="drawing-board">
                  <motion.div 
                    layout
                    className="shape-display"
                    style={{ 
                      width: geoShape.size, 
                      height: geoShape.size, 
                      background: 'var(--primary)', 
                      borderRadius: geoShape.type === 'circle' ? '50%' : '8px',
                      clipPath: geoShape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                    }}
                  />
                  <div className="shape-data">
                    <h3>Properties</h3>
                    <p>Area: {geoShape.type === 'square' ? geoShape.size * geoShape.size : 
                           geoShape.type === 'circle' ? Math.round(Math.PI * (geoShape.size/2)**2) : 
                           Math.round(0.5 * geoShape.size * geoShape.size)} units²</p>
                  </div>
                </div>
              </div>
            )}
            {activeGame === 'num' && (
              <div className="number-quest">
                <div className="quest-card">
                  <div className="timer-bar" />
                  <h1>12 x 8 = ?</h1>
                  <div className="options-grid">
                    {[84, 96, 72, 108].map(o => (
                      <button key={o} className="btn btn-ghost btn-lg" onClick={() => o === 96 ? toast('Correct! +10🍎', 'success') : toast('Try again!', 'error')}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeGame === 'logic' && (
              <div className="empty-state">
                <h2>🔌 Logic Gates Hub</h2>
                <p>Coming soon: Connect AND/OR gates to light up the bulb!</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .maths-games-fullscreen {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #1e293b; color: white; z-index: 2000;
          display: flex; flex-direction: column;
        }
        .games-content { flex: 1; padding: 40px; overflow-y: auto; display: flex; align-items: center; justify-content: center; }
        .game-selection { text-align: center; width: 100%; max-width: 1000px; }
        .game-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 40px; }
        .game-card { 
          background: #334155; padding: 40px; border-radius: 24px; cursor: pointer; 
          border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s;
        }
        .game-card:hover { border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .game-icon { font-size: 4rem; margin-bottom: 20px; }
        
        .active-game-workspace { width: 100%; height: 100%; display: flex; }
        .geo-builder { display: flex; width: 100%; gap: 40px; }
        .sidebar-tools { width: 250px; background: rgba(0,0,0,0.2); padding: 25px; border-radius: 16px; display: flex; flex-direction: column; gap: 15px; }
        .drawing-board { flex: 1; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; position: relative; color: #333; }
        .shape-data { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.05); padding: 15px; border-radius: 12px; }
        
        .number-quest { width: 100%; display: flex; align-items: center; justify-content: center; }
        .quest-card { background: #334155; padding: 60px; border-radius: 32px; text-align: center; width: 100%; max-width: 600px; }
        .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 40px; }
      `}</style>
    </div>
  )
}
