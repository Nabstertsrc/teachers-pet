import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const TECH_COMPONENTS = [
  { id: 'battery', name: 'Battery', icon: '🔋', type: 'source' },
  { id: 'bulb', name: 'Bulb', icon: '💡', type: 'output' },
  { id: 'switch', name: 'Switch', icon: '⏻', type: 'control' },
  { id: 'wire', name: 'Wire', icon: '〰️', type: 'connector' },
]

export default function TechnologyLab() {
  const toast = useToast()
  const [tab, setTab] = useState('circuits')
  const [circuit, setCircuit] = useState([])
  const [switchOn, setSwitchOn] = useState(false)
  const [bridgeLoad, setBridgeLoad] = useState(0)

  const addToCircuit = (comp) => {
    if (circuit.length < 5) {
      setCircuit([...circuit, { ...comp, uid: Date.now() }])
    } else {
      toast('Circuit board is full!', 'warning')
    }
  }

  const isCircuitComplete = circuit.some(c => c.id === 'battery') && 
                            circuit.some(c => c.id === 'bulb') && 
                            (circuit.some(c => c.id === 'switch') ? switchOn : true)

  return (
    <div className="lab-fullscreen animate-fade">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🛠️</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Technology Lab (STEM)</h2>
        </div>
        <div className="lab-tabs">
          <button className={`nav-btn ${tab === 'circuits' ? 'active' : ''}`} onClick={() => setTab('circuits')}>🔌 Circuits</button>
          <button className={`nav-btn ${tab === 'mechanics' ? 'active' : ''}`} onClick={() => setTab('mechanics')}>⚙️ Mechanics</button>
          <button className={`nav-btn ${tab === 'structures' ? 'active' : ''}`} onClick={() => setTab('structures')}>🏗️ Structures</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Lab</button>
      </div>

      <div className="lab-main">
        {tab === 'circuits' && (
          <div className="circuits-layout">
            <div className="tech-toolbar">
              <h3>Components</h3>
              <div className="comp-grid">
                {TECH_COMPONENTS.map(c => (
                  <button key={c.id} className="comp-btn" onClick={() => addToCircuit(c)}>
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 20, width: '100%' }} onClick={() => {setCircuit([]); setSwitchOn(false)}}>Reset Board</button>
            </div>

            <div className="circuit-board">
              <div className="board-grid">
                {circuit.map((c, i) => (
                  <motion.div 
                    key={c.uid} 
                    className={`board-comp ${c.id === 'bulb' && isCircuitComplete ? 'glowing' : ''}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => c.id === 'switch' && setSwitchOn(!switchOn)}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{c.id === 'bulb' && isCircuitComplete ? '💡' : c.id === 'switch' && switchOn ? '🔌' : c.icon}</span>
                    <div className="comp-label">{c.name} {c.id === 'switch' ? (switchOn ? '(ON)' : '(OFF)') : ''}</div>
                  </motion.div>
                ))}
                {circuit.length === 0 && <div className="empty-hint">Add components to build a circuit!</div>}
              </div>
              <div className="status-panel">
                <div className={`status-light ${isCircuitComplete ? 'on' : ''}`} />
                <span>{isCircuitComplete ? 'Circuit Complete: ENERGY FLOWING' : 'Circuit Incomplete'}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'mechanics' && (
          <div className="mechanics-layout">
            <div className="card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
              <h3>⚙️ Simple Machines: The Lever</h3>
              <p>Adjust the fulcrum to see how it changes the mechanical advantage.</p>
              <div className="lever-viz" style={{ height: 200, position: 'relative', marginTop: 40 }}>
                <div className="fulcrum" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '40px solid #64748b' }} />
                <motion.div 
                  className="lever-arm" 
                  style={{ position: 'absolute', bottom: 40, left: '10%', right: '10%', height: 10, background: '#94a3b8', borderRadius: 5 }}
                  animate={{ rotate: bridgeLoad > 50 ? 10 : bridgeLoad < -50 ? -10 : 0 }}
                >
                  <div className="load" style={{ position: 'absolute', top: -30, left: 0, fontSize: '2rem' }}>📦</div>
                  <div className="effort" style={{ position: 'absolute', top: -30, right: 0, fontSize: '2rem' }}>💪</div>
                </motion.div>
              </div>
              <div style={{ marginTop: 40 }}>
                <label>Adjust Effort: {bridgeLoad}</label>
                <input type="range" min="-100" max="100" value={bridgeLoad} onChange={e => setBridgeLoad(parseInt(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {tab === 'structures' && (
          <div className="structures-layout">
             <div className="card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
              <h3>🏗️ Structure Test: The Bridge</h3>
              <p>Increase the load to test the bridge's structural integrity.</p>
              <div className="bridge-viz" style={{ height: 150, borderBottom: '4px solid #334155', margin: '40px 0', position: 'relative' }}>
                <motion.div 
                  className="bridge-arch" 
                  style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 60, border: '4px solid #38bdf8', borderBottom: 'none', borderRadius: '50% 50% 0 0' }}
                  animate={{ scaleY: 1 - (bridgeLoad / 200), y: bridgeLoad / 4 }}
                />
                <motion.div 
                  className="bridge-deck" 
                  style={{ position: 'absolute', bottom: 60, left: '5%', right: '5%', height: 8, background: '#38bdf8', borderRadius: 4 }}
                  animate={{ y: bridgeLoad / 2, rotate: bridgeLoad / 20 }}
                >
                   <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', fontSize: '2.5rem' }}>🚚</div>
                </motion.div>
              </div>
              <div className="load-control">
                <label>Load Weight: {bridgeLoad} kg</label>
                <input type="range" min="0" max="150" value={bridgeLoad} onChange={e => setBridgeLoad(parseInt(e.target.value))} />
                {bridgeLoad > 120 && <div style={{ color: '#ef4444', fontWeight: 800, marginTop: 10 }}>⚠️ STRUCTURAL FAILURE IMMINENT!</div>}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .lab-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0e1a; color: white; z-index: 2000; display: flex; flex-direction: column; }
        .lab-hdr { padding: 12px 24px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; }
        .lab-tabs { display: flex; gap: 10px; }
        .nav-btn { background: none; border: none; color: #94a3b8; padding: 8px 16px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .nav-btn.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; }
        
        .lab-main { flex: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        
        .circuits-layout { display: flex; width: 100%; height: 100%; }
        .tech-toolbar { width: 280px; background: #111827; padding: 20px; border-right: 1px solid #1f2937; }
        .comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
        .comp-btn { background: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 8px; color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; transition: all 0.2s; }
        .comp-btn:hover { border-color: #38bdf8; background: #334155; }
        
        .circuit-board { flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .board-grid { display: flex; gap: 20px; min-height: 150px; align-items: center; justify-content: center; border: 2px dashed #334155; padding: 40px; border-radius: 20px; background: rgba(0,0,0,0.2); }
        .board-comp { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; }
        .board-comp.glowing { filter: drop-shadow(0 0 15px #fbbf24); }
        .comp-label { font-size: 0.7rem; opacity: 0.6; }
        .empty-hint { opacity: 0.3; font-style: italic; }
        
        .status-panel { margin-top: 40px; display: flex; align-items: center; gap: 10px; padding: 10px 20px; background: #1e293b; border-radius: 50px; }
        .status-light { width: 12px; height: 12px; border-radius: 50%; background: #ef4444; }
        .status-light.on { background: #2ecc71; box-shadow: 0 0 10px #2ecc71; }
      `}</style>
    </div>
  )
}
