import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const GEO_FEATURES = [
  { id: 'mtn', name: 'Mountain', icon: '⛰️', color: '#7f8c8d' },
  { id: 'river', name: 'River', icon: '🌊', color: '#3498db' },
  { id: 'forest', name: 'Forest', icon: '🌲', color: '#27ae60' },
  { id: 'city', name: 'City', icon: '🏙️', color: '#2c3e50' },
  { id: 'desert', name: 'Desert', icon: '🏜️', color: '#f1c40f' },
]

export default function SocialSciencesHub() {
  const toast = useToast()
  const [tab, setTab] = useState('geography')
  const [mapItems, setMapItems] = useState([])
  const [price, setPrice] = useState(50)
  const [demand, setDemand] = useState(50)

  const handleDrop = (e) => {
    // Basic drag-drop logic for a simple simulation
    const item = GEO_FEATURES.find(f => f.id === e)
    if (item) {
      setMapItems([...mapItems, { ...item, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, id: Date.now() }])
    }
  }

  return (
    <div className="ss-hub-fullscreen animate-fade">
      <div className="lab-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <h2 style={{ margin: 0 }}>Social Sciences Hub (CAPS)</h2>
        </div>
        <div className="lab-nav">
          <button className={`nav-btn ${tab === 'geography' ? 'active' : ''}`} onClick={() => setTab('geography')}>📍 Geography Map Work</button>
          <button className={`nav-btn ${tab === 'economics' ? 'active' : ''}`} onClick={() => setTab('economics')}>💰 Economics Market</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Hub</button>
      </div>

      <div className="lab-content">
        {tab === 'geography' && (
          <div className="geo-workspace">
            <div className="geo-toolbar">
              <h3>🗺️ Map Features</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: 15 }}>Drag features onto the map to build a landscape.</p>
              <div className="feature-list">
                {GEO_FEATURES.map(f => (
                  <motion.div 
                    key={f.id} 
                    className="feature-drag-item"
                    drag
                    dragSnapToOrigin
                    onDragEnd={(e, info) => {
                      if (info.point.x > 300) { // Simple "drop zone" check
                        handleDrop(f.id)
                        toast(`Added ${f.name} to map!`, 'success')
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                    <span>{f.name}</span>
                  </motion.div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => setMapItems([])}>Clear Map</button>
            </div>

            <div className="map-canvas">
              <div className="map-grid">
                {mapItems.map(item => (
                  <motion.div 
                    key={item.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="placed-feature"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    drag
                  >
                    {item.icon}
                    <div className="feature-label">{item.name}</div>
                  </motion.div>
                ))}
                {mapItems.length === 0 && <div className="empty-map-hint">Drag features here to start building your CAPS map!</div>}
              </div>
            </div>
          </div>
        )}

        {tab === 'economics' && (
          <div className="eco-workspace">
            <div className="grid-2" style={{ width: '100%', maxWidth: 1200 }}>
              <div className="card">
                <h3>📉 Supply & Demand Simulator</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>Adjust the price and see how it affects demand in the market.</p>
                
                <div className="form-group">
                  <label className="form-label">Product Price: R{price}</label>
                  <input type="range" min="10" max="100" value={price} onChange={e => {
                    const newPrice = parseInt(e.target.value)
                    setPrice(newPrice)
                    setDemand(110 - newPrice) // Inverse relationship
                  }} />
                </div>

                <div className="market-stats" style={{ marginTop: 30 }}>
                  <div className="stat-box">
                    <span className="stat-label">Market Demand</span>
                    <span className="stat-value" style={{ color: demand > 70 ? '#2ecc71' : demand > 30 ? '#f1c40f' : '#e74c3c' }}>
                      {demand}% {demand > 70 ? '🔥 High' : demand > 30 ? '⚖️ Stable' : '❄️ Low'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'white', color: '#333' }}>
                <h3>Visual Graph</h3>
                <div style={{ height: 300, position: 'relative', borderLeft: '2px solid #ccc', borderBottom: '2px solid #ccc', margin: '20px 0' }}>
                  {/* Demand Curve */}
                  <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                    <motion.line 
                      x1="10%" y1="10%" x2="90%" y2="90%" 
                      stroke="#e74c3c" strokeWidth="3" 
                      animate={{ opacity: 1 }}
                    />
                    <text x="92%" y="90%" fill="#e74c3c" fontSize="12">Demand</text>
                    
                    {/* Price Line */}
                    <motion.line 
                      x1="0" y1={`${100 - price}%`} x2="100%" y2={`${100 - price}%`} 
                      stroke="rgba(52, 152, 219, 0.5)" strokeWidth="2" strokeDasharray="5,5"
                    />
                  </svg>
                  <div style={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>Quantity</div>
                  <div style={{ position: 'absolute', left: -45, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.8rem' }}>Price</div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>Interact with the slider to see economic principles in action.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ss-hub-fullscreen {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #0f172a; color: white; z-index: 2000;
          display: flex; flex-direction: column;
        }
        .geo-workspace { display: flex; height: 100%; }
        .geo-toolbar { width: 300px; background: #1e293b; padding: 25px; border-right: 1px solid #334155; }
        .feature-list { display: flex; flex-direction: column; gap: 12px; }
        .feature-drag-item { 
          background: #334155; padding: 12px 18px; border-radius: 12px; 
          display: flex; align-items: center; gap: 15px; cursor: grab;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .feature-drag-item:active { cursor: grabbing; }
        
        .map-canvas { flex: 1; padding: 40px; background: #0f172a; }
        .map-grid { 
          width: 100%; height: 100%; background: #1e293b; border-radius: 24px; 
          position: relative; overflow: hidden; border: 4px solid #334155;
          background-image: radial-gradient(#334155 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .placed-feature { 
          position: absolute; font-size: 2.5rem; display: flex; flex-direction: column; 
          align-items: center; cursor: move;
        }
        .feature-label { font-size: 0.6rem; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; margin-top: 4px; }
        .empty-map-hint { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.3; font-size: 1.2rem; }

        .eco-workspace { height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .stat-box { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; text-align: center; }
        .stat-label { display: block; font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; }
        .stat-value { font-size: 1.5rem; font-weight: 800; }
      `}</style>
    </div>
  )
}
