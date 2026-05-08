import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { db } from '../../lib/db'
import { generateLabContent } from '../../lib/gemini'

const PLANETS = [
  { name: 'Mercury', color: '#9ca3af', size: 10, dist: 40, facts: 'Smallest planet, closest to the Sun.' },
  { name: 'Venus', color: '#fbbf24', size: 15, dist: 70, facts: 'Hottest planet in our solar system.' },
  { name: 'Earth', color: '#3b82f6', size: 16, dist: 100, facts: 'Our home, only known planet with life.' },
  { name: 'Mars', color: '#ef4444', size: 12, dist: 130, facts: 'The Red Planet, home to Olympus Mons.' },
  { name: 'Jupiter', color: '#d97706', size: 30, dist: 180, facts: 'Largest planet, a gas giant.' },
]

export default function NaturalSciencesLab() {
  const toast = useToast()
  const [tab, setTab] = useState('solar')
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [waterPhase, setWaterPhase] = useState('idle')
  const [quizzes, setQuizzes] = useState([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const grade = 9

  const loadQuizzes = async () => {
    setLoading(true)
    try {
      const cached = await db.lab_content.where({ labType: 'natural_science', grade }).first()
      if (cached && cached.content) {
        setQuizzes(cached.content)
      } else {
        toast('Generating Science Quiz...', 'info')
        const items = await generateLabContent('natural_science', grade)
        if (items) {
          setQuizzes(items)
          await db.lab_content.add({ labType: 'natural_science', grade, content: items, generatedAt: new Date().toISOString() })
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleQuizTab = () => {
    setTab('quiz')
    if (quizzes.length === 0) loadQuizzes()
  }

  const checkAnswer = (ans) => {
    if (ans === quizzes[quizIdx].a) {
      setQuizScore(s => s + 10)
      toast('Correct! +10🍎', 'success')
      setQuizIdx(i => (i + 1) % quizzes.length)
    } else {
      toast('Incorrect. Try again.', 'error')
    }
  }

  return (
    <div className="lab-fullscreen animate-fade">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🧬</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Natural Sciences Lab (CAPS)</h2>
        </div>
        <div className="lab-tabs">
          <button className={`nav-btn ${tab === 'solar' ? 'active' : ''}`} onClick={() => setTab('solar')}>🪐 Solar System</button>
          <button className={`nav-btn ${tab === 'water' ? 'active' : ''}`} onClick={() => setTab('water')}>💧 Water Cycle</button>
          <button className={`nav-btn ${tab === 'quiz' ? 'active' : ''}`} onClick={handleQuizTab}>🧠 AI Quiz</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Lab</button>
      </div>

      <div className="lab-main">
        {tab === 'solar' && (
          <div className="solar-layout">
            <div className="solar-canvas">
              <div className="sun" />
              {PLANETS.map((p, i) => (
                <div key={p.name} className="orbit" style={{ width: p.dist * 2.5, height: p.dist * 2.5 }}>
                  <motion.div 
                    className="planet" 
                    style={{ width: p.size, height: p.size, background: p.color, top: '50%', left: -p.size/2, marginTop: -p.size/2 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10 + i * 5, ease: 'linear' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedPlanet(p); }}
                  />
                </div>
              ))}
              <div className="solar-hint">Click a planet to learn more!</div>
            </div>

            <AnimatePresence>
              {selectedPlanet && (
                <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="planet-sidebar">
                  <button className="close-btn" onClick={() => setSelectedPlanet(null)}>×</button>
                  <div className="planet-icon-large" style={{ background: selectedPlanet.color }} />
                  <h2>{selectedPlanet.name}</h2>
                  <p>{selectedPlanet.facts}</p>
                  <div className="planet-stats">
                    <div className="stat">Type: <span>Planetary Science</span></div>
                    <div className="stat">CAPS Grade: <span>4-9</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tab === 'water' && (
          <div className="water-cycle-layout">
            <div className="card" style={{ maxWidth: 700, width: '100%', textAlign: 'center' }}>
              <h3>🌊 Interactive Water Cycle</h3>
              <p>Click the Sun, Ocean, or Clouds to trigger the cycle!</p>
              
              <div className="cycle-viz">
                <svg viewBox="0 0 400 300" width="100%" height="300">
                  {/* Ocean */}
                  <rect x="0" y="220" width="400" height="80" fill="#3b82f6" opacity="0.6" onClick={() => setWaterPhase('evaporation')} style={{ cursor: 'pointer' }} />
                  
                  {/* Sun */}
                  <motion.circle cx="350" cy="50" r="30" fill="#fbbf24" onClick={() => setWaterPhase('evaporation')} style={{ cursor: 'pointer' }} animate={{ scale: waterPhase === 'evaporation' ? [1, 1.2, 1] : 1 }} transition={{ repeat: waterPhase === 'evaporation' ? Infinity : 0 }} />
                  
                  {/* Clouds */}
                  <motion.g onClick={() => setWaterPhase('precipitation')} style={{ cursor: 'pointer' }} animate={{ x: waterPhase === 'condensation' ? [0, 20, 0] : 0 }}>
                    <circle cx="100" cy="70" r="25" fill="white" />
                    <circle cx="130" cy="70" r="30" fill="white" />
                    <circle cx="160" cy="70" r="25" fill="white" />
                  </motion.g>

                  {/* Evaporation lines */}
                  {waterPhase === 'evaporation' && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {[80, 150, 220].map(x => (
                        <motion.path key={x} d={`M${x},210 L${x},100`} stroke="white" strokeWidth="2" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
                      ))}
                    </motion.g>
                  )}

                  {/* Rain */}
                  {waterPhase === 'precipitation' && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {[100, 120, 140, 160].map(x => (
                        <motion.path key={x} d={`M${x},100 L${x},200`} stroke="#3b82f6" strokeWidth="2" animate={{ y: [0, 20] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      ))}
                    </motion.g>
                  )}
                </svg>
              </div>

              <div className="cycle-controls">
                <div className={`phase-tag ${waterPhase}`}>{waterPhase.toUpperCase()}</div>
                <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setWaterPhase('evaporation')}>Evaporation</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setWaterPhase('condensation')}>Condensation</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setWaterPhase('precipitation')}>Precipitation</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setWaterPhase('idle')}>Reset</button>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <div className="loading-text">Generating Science Questions...</div>
              </div>
            ) : quizzes.length > 0 ? (
              <div className="card" style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
                <h3 style={{ color: '#38bdf8' }}>Grade {grade} Science Challenge</h3>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 20 }}>Score: {quizScore} 🍎</div>
                <motion.div key={quizIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: 20 }}>{quizzes[quizIdx].q}</p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {quizzes[quizIdx].options.sort(() => Math.random() - 0.5).map(o => (
                      <button key={o} className="btn btn-secondary" onClick={() => checkAnswer(o)}>{o}</button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div>Failed to load quiz.</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .lab-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0e1a; color: white; z-index: 2000; display: flex; flex-direction: column; }
        .lab-hdr { padding: 12px 24px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; }
        .nav-btn { background: none; border: none; color: #94a3b8; padding: 8px 16px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .nav-btn.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; }
        .lab-main { flex: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }

        .solar-layout { height: 100%; width: 100%; display: flex; position: relative; overflow: hidden; }
        .solar-canvas { flex: 1; display: flex; align-items: center; justify-content: center; background: #0a0e1a; position: relative; }
        .sun { width: 50px; height: 50px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 50px #fbbf24; z-index: 5; }
        .orbit { position: absolute; border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .planet { position: absolute; border-radius: 50%; cursor: pointer; z-index: 10; box-shadow: 0 0 10px rgba(255,255,255,0.2); }
        .planet:hover { transform: scale(1.5) !important; box-shadow: 0 0 20px white; }
        .solar-hint { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); opacity: 0.5; font-size: 0.8rem; }

        .planet-sidebar { width: 300px; background: #111827; border-left: 1px solid #1f2937; padding: 40px 20px; position: absolute; top: 0; right: 0; bottom: 0; z-index: 20; }
        .close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: white; fontSize: 1.5rem; cursor: pointer; }
        .planet-icon-large { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(255,255,255,0.1); }
        .planet-stats { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; }
        .stat { display: flex; justify-content: space-between; font-size: 0.85rem; opacity: 0.7; }
        .stat span { font-weight: 700; color: #38bdf8; }

        .water-cycle-layout { height: 100%; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .cycle-viz { background: #1e293b; border-radius: 20px; margin: 20px 0; overflow: hidden; }
        .phase-tag { font-weight: 900; letter-spacing: 2px; color: #38bdf8; min-height: 24px; }
        .phase-tag.idle { opacity: 0; }
      `}</style>
    </div>
  )
}
