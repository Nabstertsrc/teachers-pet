import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { getAdaptivePlan, recordAdaptiveResult } from '../../lib/adaptivePlanner'

const GEO_FEATURES = [
  { id: 'mtn', name: 'Mountain', emoji: '⛰️', svg: 'M10,50 L25,10 L40,50 Z', fill: '#6b7280' },
  { id: 'river', name: 'River', emoji: '🌊', svg: 'M5,25 Q15,15 25,25 Q35,35 45,25', fill: '#3b82f6', stroke: true },
  { id: 'forest', name: 'Forest', emoji: '🌲', svg: 'M25,10 L15,40 L35,40 Z M20,40 L20,50 L30,50 L30,40', fill: '#22c55e' },
  { id: 'city', name: 'City', emoji: '🏙️', svg: 'M10,50 L10,20 L20,20 L20,50 M22,50 L22,30 L32,30 L32,50 M34,50 L34,15 L44,15 L44,50', fill: '#64748b', stroke: true },
  { id: 'desert', name: 'Desert', emoji: '🏜️', svg: 'M0,40 Q12,30 25,40 Q38,50 50,40', fill: '#eab308', stroke: true },
  { id: 'lake', name: 'Lake', emoji: '🏞️', svg: 'M25,15 C40,15 45,35 25,40 C5,35 10,15 25,15 Z', fill: '#0ea5e9' },
  { id: 'volc', name: 'Volcano', emoji: '🌋', svg: 'M10,50 L20,15 L25,20 L30,15 L40,50 Z', fill: '#b91c1c' },
]

const ECON_SCENARIOS = [
  { q: 'Price of bread rises 50%. What happens to demand?', a: 'decrease', options: ['increase', 'decrease', 'stay same'] },
  { q: 'Government gives free education grants. What happens to enrollment?', a: 'increase', options: ['increase', 'decrease', 'stay same'] },
  { q: 'A new car factory opens. What happens to local employment?', a: 'increase', options: ['increase', 'decrease', 'stay same'] },
  { q: 'Petrol price doubles. What happens to taxi fares?', a: 'increase', options: ['increase', 'decrease', 'stay same'] },
]

const WORLD_HOTSPOTS = [
  { id: 'africa', name: 'Africa', x: 332, y: 192, info: 'Second-largest continent with diverse climates and biomes.' },
  { id: 'asia', name: 'Asia', x: 388, y: 150, info: 'Largest continent by area and population.' },
  { id: 'europe', name: 'Europe', x: 343, y: 130, info: 'Dense transport networks and mixed economies.' },
  { id: 'americas', name: 'Americas', x: 236, y: 165, info: 'From Arctic tundra to Amazon rainforest systems.' },
  { id: 'oceania', name: 'Oceania', x: 463, y: 225, info: 'Island systems, coral reefs, and Pacific trade routes.' },
]

export default function SocialSciencesHub() {
  const toast = useToast()
  const [tab, setTab] = useState('geography')
  const [mapItems, setMapItems] = useState([])
  const [dragging, setDragging] = useState(null)
  const [price, setPrice] = useState(50)
  const [ecoIdx, setEcoIdx] = useState(0)
  const [ecoScore, setEcoScore] = useState(0)
  const [ecoFeedback, setEcoFeedback] = useState(null)
  const [ecoDone, setEcoDone] = useState(false)
  const [ecoDeck, setEcoDeck] = useState(ECON_SCENARIOS)
  const [curriculumFeedback, setCurriculumFeedback] = useState('')
  const [globeSpin, setGlobeSpin] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(WORLD_HOTSPOTS[0])
  const [planTick, setPlanTick] = useState(0)
  const adaptivePlan = useMemo(() => getAdaptivePlan('social-sciences', '8'), [planTick])
  const mapRef = useRef(null)

  useEffect(() => {
    const cacheKey = 'social-eco-deck:v1'
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length) {
          setEcoDeck(parsed)
          return
        }
      } catch {}
    }
    const shuffled = [...ECON_SCENARIOS].sort(() => Math.random() - 0.5)
    setEcoDeck(shuffled)
    if (typeof window !== 'undefined') localStorage.setItem(cacheKey, JSON.stringify(shuffled))
  }, [])

  const handleMapClick = (e) => {
    if (!dragging) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMapItems(prev => [...prev, { ...dragging, x, y, uid: Date.now() }])
    toast(`Placed ${dragging.name}!`, 'success')
    setDragging(null)
  }

  const checkEcon = (answer) => {
    if (ecoDone || !ecoDeck[ecoIdx]) return
    const currentQ = ecoDeck[ecoIdx]
    const correct = currentQ.a === answer
    if (correct) {
      setEcoScore(s => s + 15)
      setEcoFeedback('correct')
      toast('+15🍎 Correct!', 'success')
    } else {
      setEcoFeedback('wrong')
    }
    recordAdaptiveResult('social-sciences', '8', correct)
    setPlanTick((v) => v + 1)
    setTimeout(() => {
      setEcoFeedback(null)
      if (correct) {
        if (ecoIdx >= ecoDeck.length - 1) {
          setEcoDone(true)
        } else {
          setEcoIdx(i => i + 1)
        }
      }
    }, 1200)
  }

  const demand = Math.max(5, 110 - price)
  const supply = Math.max(5, price - 10)

  return (
    <div className="ss-fullscreen">
      <div className="ss-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🌍</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Social Sciences Hub (CAPS)</h2>
        </div>
        <div className="ss-nav">
          <button className={`nav-btn ${tab === 'geography' ? 'active' : ''}`} onClick={() => setTab('geography')}>📍 Map Builder</button>
          <button className={`nav-btn ${tab === 'globe' ? 'active' : ''}`} onClick={() => setTab('globe')}>🌐 3D Globe</button>
          <button className={`nav-btn ${tab === 'economics' ? 'active' : ''}`} onClick={() => setTab('economics')}>💰 Economics</button>
          <button className={`nav-btn ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>🧠 Econ Quiz</button>
          <button className={`nav-btn ${tab === 'curriculum' ? 'active' : ''}`} onClick={() => setTab('curriculum')}>📚 Lesson Studio</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
      </div>

      <div className="ss-body">
        <div className="adaptive-banner">
          Adaptive Plan: {adaptivePlan.level} | Mastery {adaptivePlan.mastery}% | {adaptivePlan.objective}
        </div>
        {tab === 'geography' && (
          <div className="geo-layout">
            <div className="geo-panel">
              <h3>🗺️ Features Palette</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 15 }}>Select a feature, then click on the map to place it.</p>
              <div className="feat-list">
                {GEO_FEATURES.map(f => (
                  <motion.button
                    key={f.id}
                    className={`feat-btn ${dragging?.id === f.id ? 'selected' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDragging(f)}
                  >
                    <svg viewBox="0 0 50 50" width="32" height="32">
                      <path d={f.svg} fill={f.fill} stroke={f.stroke ? f.fill : 'none'} strokeWidth="2" fillRule="evenodd" />
                    </svg>
                    <span>{f.name}</span>
                  </motion.button>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 15, width: '100%' }} onClick={() => setMapItems([])}>🗑️ Clear Map</button>
              <div className="legend" style={{ marginTop: 20 }}>
                <h4>Map Legend</h4>
                {GEO_FEATURES.map(f => (
                  <div key={f.id} className="legend-item">
                    <div className="legend-swatch" style={{ background: f.fill }} />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={mapRef}
              className={`map-canvas ${dragging ? 'placing' : ''}`}
              onClick={handleMapClick}
            >
              {/* Grid overlay */}
              <svg className="grid-svg" width="100%" height="100%">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#1e293b" strokeWidth="1" />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#1e293b" strokeWidth="1" />
                ))}
                <text x="50%" y="15" textAnchor="middle" fill="#475569" fontSize="12">N ↑</text>
              </svg>

              {/* Placed Features */}
              {mapItems.map(item => (
                <motion.div
                  key={item.uid}
                  className="placed-item"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  drag
                  dragMomentum={false}
                >
                  <svg viewBox="0 0 50 50" width="44" height="44">
                    <path d={item.svg} fill={item.fill} stroke={item.stroke ? item.fill : 'none'} strokeWidth="2" fillRule="evenodd" />
                  </svg>
                  <span className="item-label">{item.name}</span>
                </motion.div>
              ))}

              {mapItems.length === 0 && !dragging && (
                <div className="map-empty">Select a feature from the palette, then click here to place it</div>
              )}
              {dragging && (
                <div className="map-placing">Click to place: {dragging.emoji} {dragging.name}</div>
              )}
            </div>
          </div>
        )}

        {tab === 'globe' && (
          <div className="globe-layout">
            <div className="globe-stage">
              <svg viewBox="0 0 700 360" width="100%" height="360" aria-label="Interactive 3D globe">
                <defs>
                  <radialGradient id="earthGrad">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0e7490" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="700" height="360" fill="#020617" />
                <ellipse cx="350" cy="185" rx="130" ry="126" fill="url(#earthGrad)" />
                <g className={globeSpin ? 'spin-globe' : ''}>
                  <path d="M286 130 C300 105, 342 100, 366 122 C390 145, 362 180, 330 175 C312 171, 299 154, 286 130 Z" fill="#22c55e" opacity="0.9" />
                  <path d="M355 120 C394 108, 450 128, 455 165 C459 198, 418 216, 382 207 C352 198, 337 165, 355 120 Z" fill="#16a34a" opacity="0.92" />
                  <path d="M252 176 C273 160, 305 168, 315 193 C325 220, 294 241, 268 233 C244 226, 236 193, 252 176 Z" fill="#65a30d" opacity="0.9" />
                  {WORLD_HOTSPOTS.map((h) => (
                    <g key={h.id} onClick={() => {
                      setSelectedRegion(h)
                      recordAdaptiveResult('social-sciences', '8', true)
                      setPlanTick((v) => v + 1)
                    }}>
                      <circle cx={h.x} cy={h.y} r="7" fill={selectedRegion.id === h.id ? '#f97316' : '#fde047'} />
                      <circle cx={h.x} cy={h.y} r="13" fill="none" stroke="#f8fafc" strokeWidth="1">
                        <animate attributeName="r" values="9;16;9" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                </g>
                <ellipse cx="350" cy="328" rx="165" ry="14" fill="#0f172a" />
                <g>
                  <ellipse cx="350" cy="185" rx="200" ry="70" fill="none" stroke="#334155" strokeWidth="1.5" />
                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="0 350 185" to="360 350 185" dur="8s" repeatCount="indefinite" />
                    <circle cx="550" cy="185" r="12" fill="#cbd5e1" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="globe-panel">
              <h3>🌐 Earth Systems Explorer</h3>
              <p>Click hotspots to inspect regional geography and human-economic links.</p>
              <div className="card-glass" style={{ padding: 12 }}>
                <strong>{selectedRegion.name}</strong>
                <p style={{ marginTop: 8 }}>{selectedRegion.info}</p>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setGlobeSpin((v) => !v)}>
                {globeSpin ? 'Pause Globe Spin' : 'Resume Globe Spin'}
              </button>
              <p style={{ fontSize: '0.88rem', marginTop: 10, opacity: 0.8 }}>
                Inquiry Prompt: How do climate, trade routes, and population patterns affect development in this region?
              </p>
            </div>
          </div>
        )}

        {tab === 'economics' && (
          <div className="econ-layout">
            <div className="econ-card">
              <h3>📊 Supply & Demand Simulator</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: 25 }}>Move the price slider and watch the market respond in real-time.</p>
              <div className="price-control">
                <span>R10</span>
                <input type="range" min="10" max="100" value={price} onChange={e => setPrice(parseInt(e.target.value))} />
                <span>R100</span>
              </div>
              <div className="price-display">Price: <strong>R{price}</strong></div>

              <div className="graph-container">
                <svg viewBox="0 0 300 200" width="100%" height="250">
                  <line x1="40" y1="10" x2="40" y2="180" stroke="#475569" strokeWidth="2" />
                  <line x1="40" y1="180" x2="290" y2="180" stroke="#475569" strokeWidth="2" />
                  <text x="5" y="100" fill="#94a3b8" fontSize="10" transform="rotate(-90, 15, 100)">Price (R)</text>
                  <text x="165" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">Quantity</text>

                  {/* Supply curve (upward) */}
                  <line x1="50" y1="170" x2="280" y2="20" stroke="#2ecc71" strokeWidth="3" />
                  <text x="282" y="18" fill="#2ecc71" fontSize="10">S</text>

                  {/* Demand curve (downward) */}
                  <line x1="50" y1="20" x2="280" y2="170" stroke="#e74c3c" strokeWidth="3" />
                  <text x="282" y="172" fill="#e74c3c" fontSize="10">D</text>

                  {/* Equilibrium dot */}
                  <circle cx="165" cy="95" r="5" fill="#f59e0b" />
                  <text x="170" y="88" fill="#f59e0b" fontSize="9">Equilibrium</text>

                  {/* Current price line */}
                  <motion.line
                    x1="40" y1={180 - (price - 10) * 1.7} x2="290" y2={180 - (price - 10) * 1.7}
                    stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4"
                    animate={{ y1: 180 - (price - 10) * 1.7, y2: 180 - (price - 10) * 1.7 }}
                  />
                </svg>
              </div>

              <div className="market-grid">
                <div className="market-stat">
                  <div className="stat-icon" style={{ background: '#2ecc7722', color: '#2ecc71' }}>📈</div>
                  <div>
                    <div className="stat-label">Supply</div>
                    <div className="stat-val">{supply}%</div>
                  </div>
                </div>
                <div className="market-stat">
                  <div className="stat-icon" style={{ background: '#e74c3c22', color: '#e74c3c' }}>📉</div>
                  <div>
                    <div className="stat-label">Demand</div>
                    <div className="stat-val">{demand}%</div>
                  </div>
                </div>
                <div className="market-stat">
                  <div className="stat-icon" style={{ background: '#f59e0b22', color: '#f59e0b' }}>⚖️</div>
                  <div>
                    <div className="stat-label">Market</div>
                    <div className="stat-val">{supply > demand ? 'Surplus' : supply < demand ? 'Shortage' : 'Balanced'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div className="quiz-layout">
            <div className="quiz-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3>🧠 Economics Challenge</h3>
                <span className="score-pill">🍎 {ecoScore} pts</span>
              </div>
              <div className="quiz-question">
                <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 30 }}>{ecoDeck[ecoIdx]?.q || 'Loading question...'}</p>
                <div className="quiz-options">
                  {ecoDeck[ecoIdx]?.options.map(o => (
                    <motion.button
                      key={o}
                      className={`quiz-opt ${ecoFeedback && ecoDeck[ecoIdx].a === o ? 'correct' : ecoFeedback === 'wrong' ? '' : ''}`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !ecoFeedback && checkEcon(o)}
                    >
                      {o === 'increase' ? '📈' : o === 'decrease' ? '📉' : '➡️'} {o.charAt(0).toUpperCase() + o.slice(1)}
                    </motion.button>
                  ))}
                </div>
                {ecoFeedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fb correct">✅ Correct! You understand market forces.</motion.div>}
                {ecoFeedback === 'wrong' && <motion.div className="fb wrong">❌ Not quite. Think about how price affects buying behavior.</motion.div>}
                {ecoDone && <div className="fb correct">🏁 Quiz complete. No looping.</div>}
                {ecoDone && (
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEcoIdx(0); setEcoScore(0); setEcoDone(false) }}>
                    Restart Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'curriculum' && (
          <div className="quiz-layout">
            <div className="quiz-card">
              <h3>📚 Social Sciences Curriculum Studio</h3>
              <p style={{ opacity: 0.8, marginBottom: 14 }}>
                Integrate map skills + economics decision-making in one inquiry cycle.
              </p>
              <svg viewBox="0 0 700 220" width="100%" height="220" role="img" aria-label="Map scale and trade flow animation">
                <rect x="0" y="0" width="700" height="220" rx="12" fill="#0f172a" />
                <rect x="35" y="45" width="230" height="140" fill="#1e293b" stroke="#38bdf8" />
                <rect x="435" y="45" width="230" height="140" fill="#1e293b" stroke="#f59e0b" />
                <text x="45" y="38" fill="#cbd5e1" fontSize="12">Map Scale: 1 : 50 000</text>
                <text x="445" y="38" fill="#cbd5e1" fontSize="12">Market Node</text>
                <circle cx="120" cy="110" r="8" fill="#22c55e" />
                <circle cx="200" cy="150" r="8" fill="#22c55e" />
                <line x1="120" y1="110" x2="200" y2="150" stroke="#22c55e" strokeWidth="3" />
                <line x1="265" y1="115" x2="435" y2="115" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8,6">
                  <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.2s" repeatCount="indefinite" />
                </line>
                <text x="280" y="104" fill="#93c5fd" fontSize="12">Goods flow</text>
                <text x="450" y="98" fill="#f8fafc" fontSize="12">Revenue = Price × Quantity</text>
                <text x="450" y="118" fill="#f8fafc" fontSize="12">Cost = Fixed + Variable</text>
                <text x="450" y="138" fill="#22c55e" fontSize="12">Profit = Revenue - Cost</text>
              </svg>
              <div className="fb" style={{ marginTop: 12 }}>
                <p style={{ marginTop: 0 }}>Applied Question: If transport distance doubles, which metric should rise first?</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Variable cost', 'Tax rate', 'Demand certainty'].map((opt) => (
                    <button
                      key={opt}
                      className="quiz-opt"
                      style={{ padding: '10px 14px', fontSize: '0.95rem' }}
                      onClick={() => setCurriculumFeedback(opt === 'Variable cost' ? '✅ Correct: transport directly increases variable logistics cost.' : '❌ Not first-order. Start with direct transport cost drivers.')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {curriculumFeedback && <p style={{ marginTop: 8 }}>{curriculumFeedback}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ss-fullscreen { position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0e1a;color:#fff;z-index:2000;display:flex;flex-direction:column; }
        .ss-header { padding:10px 24px;background:#111827;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937; }
        .ss-nav { display:flex;gap:8px; }
        .nav-btn { background:none;border:none;color:#94a3b8;padding:8px 14px;cursor:pointer;font-weight:600;transition:all 0.2s;font-size:0.85rem; }
        .nav-btn.active { color:#38bdf8;border-bottom:2px solid #38bdf8; }
        .ss-body { flex:1;overflow:hidden; }
        .adaptive-banner { position:absolute; top:66px; left:50%; transform:translateX(-50%); z-index:5; background:#1e293b; border:1px solid #334155; border-radius:999px; padding:6px 12px; font-size:0.8rem; }

        .geo-layout { display:flex;height:100%; }
        .geo-panel { width:280px;background:#111827;padding:20px;border-right:1px solid #1f2937;overflow-y:auto; }
        .feat-list { display:flex;flex-direction:column;gap:8px; }
        .feat-btn { display:flex;align-items:center;gap:12px;background:#1a1f2e;border:2px solid #2a3040;padding:10px 14px;border-radius:12px;color:#fff;cursor:pointer;transition:all 0.2s;text-align:left; }
        .feat-btn:hover { border-color:#38bdf8; }
        .feat-btn.selected { border-color:#f59e0b;background:#f59e0b11; }
        .legend { font-size:0.75rem; }
        .legend h4 { margin:0 0 8px;opacity:0.7; }
        .legend-item { display:flex;align-items:center;gap:8px;margin:4px 0; }
        .legend-swatch { width:12px;height:12px;border-radius:3px; }

        .map-canvas { flex:1;position:relative;overflow:hidden;background:#0f172a;cursor:crosshair; }
        .map-canvas.placing { cursor:cell; }
        .grid-svg { position:absolute;top:0;left:0;pointer-events:none; }
        .placed-item { position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;cursor:grab;z-index:5; }
        .item-label { font-size:0.6rem;background:rgba(0,0,0,0.7);padding:2px 6px;border-radius:4px;margin-top:2px;white-space:nowrap; }
        .map-empty,.map-placing { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.3;font-size:1.1rem;text-align:center;pointer-events:none; }
        .map-placing { opacity:0.8;color:#f59e0b; }
        .globe-layout { display:grid; grid-template-columns: 1.2fr 0.8fr; gap:14px; height:100%; padding: 84px 18px 18px; }
        .globe-stage, .globe-panel { background:#0f172a; border:1px solid #334155; border-radius:14px; padding:10px; }
        .spin-globe { transform-origin: 350px 185px; animation: globeRotate 20s linear infinite; }
        @keyframes globeRotate { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }

        .econ-layout,.quiz-layout { height:100%;display:flex;align-items:center;justify-content:center;padding:30px; }
        .econ-card,.quiz-card { background:#1a1f2e;border:1px solid #2a3040;border-radius:24px;padding:40px;width:100%;max-width:700px; }
        .price-control { display:flex;align-items:center;gap:15px; }
        .price-control input { flex:1; }
        .price-display { text-align:center;margin:15px 0;font-size:1.5rem; }
        .graph-container { margin:20px 0; }
        .market-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px; }
        .market-stat { display:flex;align-items:center;gap:12px;background:#111827;padding:16px;border-radius:16px; }
        .stat-icon { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem; }
        .stat-label { font-size:0.75rem;opacity:0.6; }
        .stat-val { font-size:1.1rem;font-weight:700; }

        .score-pill { background:#1f2937;padding:4px 14px;border-radius:12px;font-size:0.85rem; }
        .quiz-options { display:flex;flex-direction:column;gap:14px; }
        .quiz-opt { background:#1f2937;border:2px solid #2a3040;color:#fff;padding:16px 20px;border-radius:14px;font-size:1.1rem;cursor:pointer;transition:all 0.2s;text-align:left; }
        .quiz-opt:hover { border-color:#38bdf8; }
        .quiz-opt.correct { border-color:#2ecc71;background:#2ecc7122; }
        .fb { margin-top:20px;padding:14px;border-radius:12px;font-weight:600; }
        .fb.correct { background:#2ecc7115;color:#2ecc71; }
        .fb.wrong { background:#e74c3c15;color:#e74c3c; }
        @media (max-width: 980px) {
          .globe-layout { grid-template-columns: 1fr; padding-top: 92px; }
        }
      `}</style>
    </div>
  )
}
