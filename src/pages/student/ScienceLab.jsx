import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { predictReaction } from '../../lib/gemini'
import { getAdaptivePlan, recordAdaptiveResult } from '../../lib/adaptivePlanner'

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', color: '#fff', group: 'nonmetal' },
  { symbol: 'He', name: 'Helium', color: '#ffc0cb', group: 'noble' },
  { symbol: 'Na', name: 'Sodium', color: '#c0c0c0', group: 'alkali' },
  { symbol: 'Cl', name: 'Chlorine', color: '#00ff00', group: 'halogen' },
  { symbol: 'O', name: 'Oxygen', color: '#f00', group: 'nonmetal' },
  { symbol: 'Mg', name: 'Magnesium', color: '#808080', group: 'alkaline' },
  { symbol: 'Fe', name: 'Iron', color: '#8b0000', group: 'metal' },
  { symbol: 'Cu', name: 'Copper', color: '#b87333', group: 'metal' },
  { symbol: 'S', name: 'Sulfur', color: '#ffd700', group: 'nonmetal' },
]

const PLANETS = [
  { name: 'Mercury', orbit: 42, size: 4, color: '#c7c7c7', period: 5.5, fact: 'Smallest planet, fastest orbit.' },
  { name: 'Venus', orbit: 62, size: 6, color: '#f59e0b', period: 7.2, fact: 'Thick atmosphere traps intense heat.' },
  { name: 'Earth', orbit: 86, size: 6.5, color: '#22d3ee', period: 9.4, fact: 'Only known planet with abundant liquid water.' },
  { name: 'Mars', orbit: 108, size: 5, color: '#ef4444', period: 11.8, fact: 'Home to Olympus Mons, a giant volcano.' },
  { name: 'Jupiter', orbit: 138, size: 11, color: '#fbbf24', period: 15.8, fact: 'Largest planet with a persistent storm.' },
]

const PERIODIC_TABLE = [
  { symbol: 'H', name: 'Hydrogen', number: 1, group: 'Nonmetal', config: '1s1', use: 'Fuel and ammonia production' },
  { symbol: 'He', name: 'Helium', number: 2, group: 'Noble Gas', config: '1s2', use: 'Cooling and balloons' },
  { symbol: 'Li', name: 'Lithium', number: 3, group: 'Alkali Metal', config: '[He]2s1', use: 'Rechargeable batteries' },
  { symbol: 'Be', name: 'Beryllium', number: 4, group: 'Alkaline Earth', config: '[He]2s2', use: 'Aerospace alloys' },
  { symbol: 'B', name: 'Boron', number: 5, group: 'Metalloid', config: '[He]2s2 2p1', use: 'Glass and detergents' },
  { symbol: 'C', name: 'Carbon', number: 6, group: 'Nonmetal', config: '[He]2s2 2p2', use: 'Organic chemistry base' },
  { symbol: 'N', name: 'Nitrogen', number: 7, group: 'Nonmetal', config: '[He]2s2 2p3', use: 'Fertilizers and cooling' },
  { symbol: 'O', name: 'Oxygen', number: 8, group: 'Nonmetal', config: '[He]2s2 2p4', use: 'Respiration and combustion' },
  { symbol: 'Na', name: 'Sodium', number: 11, group: 'Alkali Metal', config: '[Ne]3s1', use: 'Street lamps and salt compounds' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, group: 'Alkaline Earth', config: '[Ne]3s2', use: 'Light alloys and fireworks' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, group: 'Halogen', config: '[Ne]3s2 3p5', use: 'Water treatment' },
  { symbol: 'Fe', name: 'Iron', number: 26, group: 'Transition Metal', config: '[Ar]3d6 4s2', use: 'Construction steel' },
]

const REACTION_LIBRARY = {
  'Na+Cl': { eq: '2Na + Cl2 -> 2NaCl', effect: 'Bright flash with salt formation.' },
  'H+O': { eq: '2H2 + O2 -> 2H2O', effect: 'Exothermic synthesis of water.' },
  'Fe+O': { eq: '4Fe + 3O2 -> 2Fe2O3', effect: 'Oxidation/rusting over time.' },
  'Mg+O': { eq: '2Mg + O2 -> 2MgO', effect: 'White flame and magnesium oxide.' },
}

export default function ScienceLab() {
  const toast = useToast()
  const [tab, setTab] = useState('experiment')
  const [beakers, setBeakers] = useState([{ id: 1, elements: [] }, { id: 2, elements: [] }])
  const [activeBeaker, setActiveBeaker] = useState(1)
  const [reaction, setReaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedAtom, setSelectedAtom] = useState('H')
  const [conceptFeedback, setConceptFeedback] = useState('')
  const [selectedPlanet, setSelectedPlanet] = useState('Earth')
  const [orbitSpeed, setOrbitSpeed] = useState(1)
  const [selectedPeriodic, setSelectedPeriodic] = useState(PERIODIC_TABLE[0])
  const [reagentA, setReagentA] = useState('Na')
  const [reagentB, setReagentB] = useState('Cl')
  const [reactionEquation, setReactionEquation] = useState('Choose two elements to simulate reaction output.')
  const [planTick, setPlanTick] = useState(0)
  const grade = '8'
  const adaptivePlan = useMemo(() => getAdaptivePlan('science', grade), [planTick])
  const selectedPlanetData = PLANETS.find((p) => p.name === selectedPlanet) || PLANETS[2]

  const addElement = (el) => {
    setBeakers(prev => prev.map(b => 
      b.id === activeBeaker ? { ...b, elements: [...b.elements.slice(-1), el] } : b
    ))
  }

  const handleMix = async () => {
    const allElements = beakers.flatMap(b => b.elements)
    if (allElements.length < 2) {
      toast('Add at least two elements to beakers to mix!', 'warning')
      return
    }

    setLoading(true)
    try {
      const pairKey = [allElements[0].name, allElements[1].name].sort().join('-').toLowerCase()
      const cacheKey = `science-reaction:${pairKey}`
      const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
      const resText = cached || await predictReaction(allElements[0].name, allElements[1].name)
      if (!cached && typeof window !== 'undefined') localStorage.setItem(cacheKey, resText)
      
      const effect = resText.toLowerCase().includes('explosion') ? 'explosion' : 
                     resText.toLowerCase().includes('bubble') ? 'bubbles' : 
                     resText.toLowerCase().includes('color') ? 'color_change' : 'none'
      
      setReaction({
        title: resText.split('\n')[0].replace(/#|Title: /g, ''),
        desc: resText,
        animation: effect
      })
    } catch {
      toast('Reaction failed. Try simpler elements.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setBeakers([{ id: 1, elements: [] }, { id: 2, elements: [] }])
    setReaction(null)
  }

  return (
    <div className="science-lab-fullscreen animate-fade">
      <div className="lab-header">
        <div className="lab-nav">
          <button className={`nav-btn ${tab === 'experiment' ? 'active' : ''}`} onClick={() => setTab('experiment')}>🧪 Experiment</button>
          <button className={`nav-btn ${tab === 'atoms' ? 'active' : ''}`} onClick={() => setTab('atoms')}>⚛️ Atom Analyzer</button>
          <button className={`nav-btn ${tab === 'periodic' ? 'active' : ''}`} onClick={() => setTab('periodic')}>🧱 Periodic Table</button>
          <button className={`nav-btn ${tab === 'space' ? 'active' : ''}`} onClick={() => setTab('space')}>🪐 Space Lab</button>
          <button className={`nav-btn ${tab === 'biology' ? 'active' : ''}`} onClick={() => setTab('biology')}>🧬 Biology</button>
          <button className={`nav-btn ${tab === 'lesson' ? 'active' : ''}`} onClick={() => setTab('lesson')}>🎓 Lesson Studio</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Lab</button>
      </div>

      <div className="lab-content">
        <div className="adaptive-banner">
          Adaptive Plan: {adaptivePlan.level} | Mastery {adaptivePlan.mastery}% | {adaptivePlan.objective}
        </div>
        {tab === 'experiment' && (
          <div className="experiment-layout">
            <div className="sidebar-elements">
              <h3>Elements</h3>
              <div className="element-grid">
                {ELEMENTS.map(el => (
                  <button key={el.symbol} className="element-card" onClick={() => addElement(el)}>
                    <span className="symbol">{el.symbol}</span>
                    <span className="name">{el.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="workspace">
              <div className="beakers-row">
                {beakers.map(b => (
                  <div 
                    key={b.id} 
                    className={`beaker-slot ${activeBeaker === b.id ? 'active' : ''}`}
                    onClick={() => setActiveBeaker(b.id)}
                  >
                    <div className="beaker-label">Beaker {b.id}</div>
                    <div className="beaker-glass">
                      {b.elements.map((el, i) => (
                        <div key={i} className="liquid" style={{ height: '40%', bottom: 0, background: el.color, opacity: 0.7 }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="controls">
                <button className="btn btn-primary btn-lg mix-btn" onClick={handleMix} disabled={loading}>
                  {loading ? 'Mixing...' : '⚡ INITIATE MIX'}
                </button>
                <button className="btn btn-ghost" onClick={reset}>Reset</button>
              </div>

              <AnimatePresence>
                {reaction && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="reaction-overlay">
                    <div className="reaction-card">
                      <div className="reaction-icon">{reaction.animation === 'explosion' ? '💥' : '🧪'}</div>
                      <h2>{reaction.title}</h2>
                      <p>{reaction.desc}</p>
                      <button className="btn btn-primary btn-sm" onClick={() => setReaction(null)}>Clear</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {tab === 'atoms' && (
          <div className="atoms-layout">
            <div className="atom-selector">
              {ELEMENTS.map(el => (
                <button key={el.symbol} className={`btn-sm ${selectedAtom === el.symbol ? 'active' : ''}`} onClick={() => setSelectedAtom(el.symbol)}>{el.name}</button>
              ))}
            </div>
            <div className="atom-display">
              <div className="nucleus-large" />
              <motion.div className="orbit orbit-1" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                <div className="electron-large" />
              </motion.div>
              <motion.div className="orbit orbit-2" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
                <div className="electron-large" />
              </motion.div>
              <div className="atom-info">
                <h2>{selectedAtom} Atom</h2>
                <p>Viewing 3D Bohr Model for {selectedAtom}.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'periodic' && (
          <div className="periodic-layout">
            <div className="periodic-grid">
              {PERIODIC_TABLE.map((el) => (
                <button
                  key={el.symbol}
                  className={`periodic-cell ${selectedPeriodic.symbol === el.symbol ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPeriodic(el)
                    recordAdaptiveResult('science', grade, true)
                    setPlanTick((v) => v + 1)
                  }}
                >
                  <span className="p-num">{el.number}</span>
                  <span className="p-symbol">{el.symbol}</span>
                </button>
              ))}
            </div>
            <div className="periodic-info">
              <h3>{selectedPeriodic.name} ({selectedPeriodic.symbol})</h3>
              <p>Atomic Number: {selectedPeriodic.number}</p>
              <p>Group: {selectedPeriodic.group}</p>
              <p>Electron Config: {selectedPeriodic.config}</p>
              <p>Real-world use: {selectedPeriodic.use}</p>
              <div className="reaction-sim">
                <h4>Reaction Animator</h4>
                <div className="sim-controls">
                  <select className="form-input" value={reagentA} onChange={(e) => setReagentA(e.target.value)}>
                    {PERIODIC_TABLE.map((el) => <option key={`a-${el.symbol}`} value={el.symbol}>{el.symbol}</option>)}
                  </select>
                  <select className="form-input" value={reagentB} onChange={(e) => setReagentB(e.target.value)}>
                    {PERIODIC_TABLE.map((el) => <option key={`b-${el.symbol}`} value={el.symbol}>{el.symbol}</option>)}
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const key = `${reagentA}+${reagentB}`
                      const reverseKey = `${reagentB}+${reagentA}`
                      const known = REACTION_LIBRARY[key] || REACTION_LIBRARY[reverseKey]
                      setReactionEquation(known ? `${known.eq} | ${known.effect}` : `No curated equation for ${reagentA} + ${reagentB}. Use experiment tab for AI prediction.`)
                      recordAdaptiveResult('science', grade, Boolean(known))
                      setPlanTick((v) => v + 1)
                    }}
                  >
                    Simulate
                  </button>
                </div>
                <svg viewBox="0 0 420 120" width="100%" height="120" aria-label="reaction animation">
                  <rect x="0" y="0" width="420" height="120" fill="#0b1220" rx="10" />
                  <rect x="50" y="35" width="70" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" />
                  <rect x="300" y="35" width="70" height="70" rx="8" fill="#1e293b" stroke="#f97316" />
                  <circle cx="85" cy="70" r="8" fill="#22d3ee">
                    <animate attributeName="cy" values="70;60;70" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="335" cy="70" r="8" fill="#f59e0b">
                    <animate attributeName="cy" values="70;60;70" dur="0.9s" repeatCount="indefinite" />
                  </circle>
                  <line x1="130" y1="70" x2="290" y2="70" stroke="#94a3b8" strokeWidth="3" strokeDasharray="7,5">
                    <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.1s" repeatCount="indefinite" />
                  </line>
                </svg>
                <p style={{ fontSize: '0.9rem' }}>{reactionEquation}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'space' && (
          <div className="space-layout">
            <div className="space-canvas">
              <svg viewBox="0 0 640 340" width="100%" height="340" aria-label="3D solar system model">
                <defs>
                  <radialGradient id="sunGlow">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f97316" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="640" height="340" fill="#020617" />
                {PLANETS.map((p) => (
                  <ellipse key={`orbit-${p.name}`} cx="320" cy="170" rx={p.orbit} ry={Math.max(20, p.orbit * 0.28)} fill="none" stroke="#334155" strokeWidth="1" />
                ))}
                <circle cx="320" cy="170" r="22" fill="url(#sunGlow)" />
                {PLANETS.map((p) => (
                  <g key={p.name}>
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`0 320 170`}
                        to={`360 320 170`}
                        dur={`${(p.period / Math.max(0.3, orbitSpeed)).toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                      <ellipse cx={320 + p.orbit} cy={170} rx={p.size + 2} ry={p.size} fill={p.color} opacity="0.95" onClick={() => {
                        setSelectedPlanet(p.name)
                        recordAdaptiveResult('science', grade, true)
                        setPlanTick((v) => v + 1)
                      }} />
                    </g>
                  </g>
                ))}
              </svg>
            </div>
            <div className="space-info">
              <h3>🪐 Planet Explorer</h3>
              <p>Select a moving planet to inspect its orbit.</p>
              <div className="planet-buttons">
                {PLANETS.map((p) => (
                  <button key={p.name} className={`btn btn-sm ${selectedPlanet === p.name ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSelectedPlanet(p.name)}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="card-glass" style={{ padding: 12, marginTop: 10 }}>
                <strong>{selectedPlanetData.name}</strong>
                <p style={{ margin: '6px 0' }}>{selectedPlanetData.fact}</p>
                <p style={{ margin: 0 }}>Orbit Radius Index: {selectedPlanetData.orbit}</p>
              </div>
              <label style={{ display: 'block', marginTop: 10 }}>Orbit Speed</label>
              <input type="range" min="0.4" max="2.4" step="0.1" value={orbitSpeed} onChange={(e) => setOrbitSpeed(Number(e.target.value))} />
              <div style={{ fontSize: '0.85rem', marginTop: 4 }}>Speed: {orbitSpeed.toFixed(1)}x</div>
            </div>
          </div>
        )}

        {tab === 'biology' && (
          <div className="biology-layout">
            <div className="cell-diag">
              <div className="cell-wall">
                <div className="nucleus-cell">DNA</div>
                <div className="mitochondria">⚡</div>
              </div>
              <div className="diag-labels">
                <h3>Plant Cell Diagram</h3>
                <ul>
                  <li><strong>Nucleus:</strong> The control center</li>
                  <li><strong>Mitochondria:</strong> The powerhouse</li>
                  <li><strong>Cell Wall:</strong> Protection</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === 'lesson' && (
          <div className="lesson-layout">
            <div className="lesson-card">
              <h3>⚗️ Advanced Science Lesson</h3>
              <p style={{ color: '#cbd5e1' }}>
                Topic: conservation of mass, energy transfer, and reaction rate through animated modeling.
              </p>
              <svg viewBox="0 0 480 220" width="100%" height="220" role="img" aria-label="Particle collision animation">
                <rect x="0" y="0" width="480" height="220" fill="#0b1220" rx="14" />
                <line x1="20" y1="170" x2="460" y2="170" stroke="#334155" strokeWidth="2" />
                <circle cx="90" cy="120" r="18" fill="#38bdf8">
                  <animate attributeName="cx" values="90;240;90" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="390" cy="120" r="18" fill="#f97316">
                  <animate attributeName="cx" values="390;240;390" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="240" cy="120" r="6" fill="#22c55e">
                  <animate attributeName="r" values="6;16;6" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <text x="20" y="25" fill="#e2e8f0" fontSize="12">Energy transfer at collision point</text>
                <text x="20" y="45" fill="#38bdf8" fontSize="12">Eₖ = 1/2mv²</text>
                <text x="20" y="62" fill="#f97316" fontSize="12">m₁v₁ + m₂v₂ = (m₁+m₂)vₓ</text>
              </svg>
              <div className="concept-check">
                <p style={{ fontWeight: 700, marginBottom: 8 }}>Checkpoint: If temperature rises, collision frequency usually...</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Increases', 'Decreases', 'Stays unchanged'].map((opt) => (
                    <button
                      key={opt}
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const correct = opt === 'Increases'
                        setConceptFeedback(correct ? '✅ Correct: particles move faster and collide more often.' : '❌ Recheck kinetic theory and particle speed.')
                        recordAdaptiveResult('science', grade, correct)
                        setPlanTick((v) => v + 1)
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {conceptFeedback && <p style={{ marginTop: 10 }}>{conceptFeedback}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .science-lab-fullscreen {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #0f172a; color: white; z-index: 2000;
          display: flex; flex-direction: column;
        }
        .lab-header { 
          padding: 12px 24px; background: #1e293b; display: flex; 
          justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;
        }
        .lab-nav { display: flex; gap: 10px; }
        .nav-btn { 
          background: none; border: none; color: #94a3b8; padding: 8px 16px; 
          cursor: pointer; font-weight: 600; transition: all 0.2s;
        }
        .nav-btn.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; }
        
        .lab-content { flex: 1; overflow: hidden; position: relative; }
        .adaptive-banner { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 12; background: #0f172a; border: 1px solid #334155; border-radius: 999px; padding: 6px 12px; font-size: 0.8rem; }
        .experiment-layout { display: flex; height: 100%; }
        
        .sidebar-elements { 
          width: 280px; background: #1e293b; padding: 20px; 
          border-right: 1px solid #334155; overflow-y: auto;
        }
        .element-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
        .element-card { 
          background: #334155; border: 1px solid #475569; padding: 12px; border-radius: 8px; 
          cursor: pointer; text-align: center; color: white; transition: all 0.2s;
        }
        .element-card:hover { border-color: #38bdf8; background: #475569; }
        .element-card .symbol { display: block; font-size: 1.2rem; font-weight: 800; }
        .element-card .name { font-size: 0.7rem; opacity: 0.7; }

        .workspace { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .beakers-row { display: flex; gap: 40px; margin-bottom: 40px; }
        .beaker-slot { 
          width: 150px; height: 200px; padding: 10px; border: 2px dashed #475569; 
          border-radius: 12px; cursor: pointer; position: relative;
        }
        .beaker-slot.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); }
        .beaker-label { text-align: center; font-size: 0.8rem; margin-bottom: 10px; color: #94a3b8; }
        .beaker-glass { 
          width: 100px; height: 130px; border: 3px solid rgba(255,255,255,0.4); 
          border-top: none; border-radius: 0 0 15px 15px; margin: 0 auto; position: relative; overflow: hidden;
        }
        .liquid { position: absolute; left: 0; right: 0; transition: all 0.5s; }

        .mix-btn { 
          background: #38bdf8; padding: 15px 40px; border-radius: 50px; font-weight: 800; 
          letter-spacing: 1px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .reaction-overlay { 
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10;
        }
        .reaction-card { 
          background: #1e293b; padding: 40px; border-radius: 24px; max-width: 500px; 
          text-align: center; border: 1px solid #38bdf8;
        }
        .reaction-icon { font-size: 4rem; margin-bottom: 20px; }

        .atoms-layout { height: 100%; display: flex; flex-direction: column; align-items: center; padding: 40px; }
        .atom-display { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; width: 100%; }
        .nucleus-large { width: 40px; height: 40px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 30px #ef4444; z-index: 5; }
        .orbit { position: absolute; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 50%; }
        .orbit-1 { width: 150px; height: 150px; }
        .orbit-2 { width: 250px; height: 250px; }
        .electron-large { width: 12px; height: 12px; background: #38bdf8; border-radius: 50%; position: absolute; top: -6px; left: 50%; }
        
        .biology-layout { height: 100%; display: flex; align-items: center; justify-content: center; }
        .cell-diag { display: flex; gap: 40px; align-items: center; }
        .cell-wall { width: 300px; height: 200px; border: 4px solid #2ecc71; border-radius: 40px; position: relative; display: flex; align-items: center; justify-content: center; }
        .nucleus-cell { width: 60px; height: 60px; background: #9b59b6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
        .lesson-layout { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .lesson-card { width: min(900px, 100%); background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 24px; }
        .concept-check { margin-top: 14px; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px; }
        .periodic-layout { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 70px 18px 18px; height: 100%; }
        .periodic-grid { display:grid; grid-template-columns: repeat(6, minmax(52px, 1fr)); gap:8px; align-content: start; background:#0f172a; border:1px solid #334155; border-radius:12px; padding:10px; }
        .periodic-cell { background:#1e293b; color:#fff; border:1px solid #334155; border-radius:8px; min-height:56px; cursor:pointer; position:relative; }
        .periodic-cell.active { border-color:#38bdf8; box-shadow:0 0 0 2px rgba(56,189,248,0.2) inset; }
        .p-num { position:absolute; top:4px; left:5px; font-size:0.62rem; opacity:0.7; }
        .p-symbol { font-weight:800; font-size:1rem; }
        .periodic-info { background:#1e293b; border:1px solid #334155; border-radius:12px; padding:12px; overflow:auto; }
        .reaction-sim { margin-top: 10px; background:#0f172a; border:1px solid #334155; border-radius:10px; padding:10px; }
        .sim-controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .space-layout { display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 14px; padding: 70px 18px 18px; height:100%; }
        .space-canvas, .space-info { background:#0f172a; border:1px solid #334155; border-radius:12px; padding:10px; }
        .planet-buttons { display:flex; gap:8px; flex-wrap:wrap; }
        @media (max-width: 980px) {
          .periodic-layout, .space-layout { grid-template-columns: 1fr; padding-top: 84px; }
        }
      `}</style>
    </div>
  )
}
