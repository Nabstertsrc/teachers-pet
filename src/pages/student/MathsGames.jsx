import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const GRADES = [
  { id: 'R', label: 'Grade R', band: 'foundation', color: '#f472b6' },
  { id: '1', label: 'Grade 1', band: 'foundation', color: '#fb923c' },
  { id: '2', label: 'Grade 2', band: 'foundation', color: '#facc15' },
  { id: '3', label: 'Grade 3', band: 'foundation', color: '#a3e635' },
  { id: '4', label: 'Grade 4', band: 'intermediate', color: '#34d399' },
  { id: '5', label: 'Grade 5', band: 'intermediate', color: '#22d3ee' },
  { id: '6', label: 'Grade 6', band: 'intermediate', color: '#60a5fa' },
  { id: '7', label: 'Grade 7', band: 'senior', color: '#818cf8' },
  { id: '8', label: 'Grade 8', band: 'senior', color: '#a78bfa' },
  { id: '9', label: 'Grade 9', band: 'senior', color: '#c084fc' },
  { id: '10', label: 'Grade 10', band: 'fet', color: '#e879f9' },
  { id: '11', label: 'Grade 11', band: 'fet', color: '#f472b6' },
  { id: '12', label: 'Grade 12', band: 'fet', color: '#fb7185' },
]

// Grade-appropriate problem generator
const genProblem = (grade) => {
  const g = grade === 'R' ? 0 : parseInt(grade)
  let a, b, op, answer, text

  if (g <= 1) {
    // Counting & simple addition up to 10
    a = Math.floor(Math.random() * 5) + 1
    b = Math.floor(Math.random() * 5) + 1
    op = '+'
    answer = a + b
    text = `${a} + ${b}`
  } else if (g <= 3) {
    // Addition & subtraction up to 50
    const ops = ['+', '-']
    op = ops[Math.floor(Math.random() * 2)]
    a = Math.floor(Math.random() * 30) + 10
    b = Math.floor(Math.random() * 10) + 1
    if (op === '-' && b > a) [a, b] = [b, a]
    answer = op === '+' ? a + b : a - b
    text = `${a} ${op} ${b}`
  } else if (g <= 6) {
    // Multiplication, division, larger numbers
    const ops = ['+', '-', '×', '÷']
    op = ops[Math.floor(Math.random() * 4)]
    if (op === '×') {
      a = Math.floor(Math.random() * 12) + 2
      b = Math.floor(Math.random() * 12) + 2
      answer = a * b
    } else if (op === '÷') {
      b = Math.floor(Math.random() * 10) + 2
      answer = Math.floor(Math.random() * 10) + 2
      a = b * answer
    } else {
      a = Math.floor(Math.random() * 100) + 20
      b = Math.floor(Math.random() * 50) + 10
      if (op === '-' && b > a) [a, b] = [b, a]
      answer = op === '+' ? a + b : a - b
    }
    text = `${a} ${op} ${b}`
  } else if (g <= 9) {
    // Integers, order of operations, powers
    const types = ['power', 'order', 'integer']
    const type = types[Math.floor(Math.random() * 3)]
    if (type === 'power') {
      a = Math.floor(Math.random() * 8) + 2
      answer = a * a
      text = `${a}²`
    } else if (type === 'integer') {
      a = Math.floor(Math.random() * 20) - 10
      b = Math.floor(Math.random() * 20) - 10
      answer = a + b
      text = `(${a}) + (${b})`
    } else {
      a = Math.floor(Math.random() * 5) + 2
      b = Math.floor(Math.random() * 5) + 1
      const c = Math.floor(Math.random() * 5) + 1
      answer = a * b + c
      text = `${a} × ${b} + ${c}`
    }
  } else {
    // Algebra, factoring hints, trig basics
    const types = ['algebra', 'sqrt', 'percentage']
    const type = types[Math.floor(Math.random() * 3)]
    if (type === 'algebra') {
      answer = Math.floor(Math.random() * 15) + 2
      b = Math.floor(Math.random() * 10) + 1
      const total = 2 * answer + b
      text = `2x + ${b} = ${total}. x = ?`
    } else if (type === 'sqrt') {
      const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]
      a = squares[Math.floor(Math.random() * squares.length)]
      answer = Math.sqrt(a)
      text = `√${a}`
    } else {
      a = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)]
      b = [100, 200, 400, 500][Math.floor(Math.random() * 4)]
      answer = (a / 100) * b
      text = `${a}% of ${b}`
    }
  }

  const wrongSet = new Set([answer])
  while (wrongSet.size < 4) {
    wrongSet.add(answer + Math.floor(Math.random() * 10) - 5 || answer + wrongSet.size)
  }
  return { text, answer, options: [...wrongSet].sort(() => Math.random() - 0.5) }
}

// SVG shape components for visual lessons
function CountingScene({ count, color }) {
  return (
    <svg viewBox="0 0 300 80" width="100%" height="80">
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i} cx={30 + i * 30} cy="40" r="12"
          fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring' }}
        />
      ))}
    </svg>
  )
}

function FractionBar({ numerator, denominator, color }) {
  const w = 240
  const sliceW = w / denominator
  return (
    <svg viewBox="0 0 260 50" width="100%" height="50">
      {Array.from({ length: denominator }).map((_, i) => (
        <motion.rect key={i} x={10 + i * sliceW} y="10" width={sliceW - 2} height="30" rx="4"
          fill={i < numerator ? color : '#1f2937'} stroke="#475569" strokeWidth="1"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.08 }}
        />
      ))}
    </svg>
  )
}

function AlgebraScale({ left, right }) {
  const balanced = left === right
  const tilt = balanced ? 0 : left > right ? -8 : 8
  return (
    <svg viewBox="0 0 300 150" width="100%" height="130">
      <line x1="150" y1="20" x2="150" y2="60" stroke="#475569" strokeWidth="3" />
      <motion.g animate={{ rotate: tilt }} style={{ transformOrigin: '150px 60px' }}>
        <line x1="50" y1="60" x2="250" y2="60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <rect x="30" y="62" width="60" height="25" rx="4" fill="#8b5cf6" />
        <text x="60" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{left}</text>
        <rect x="210" y="62" width="60" height="25" rx="4" fill="#06b6d4" />
        <text x="240" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{right}</text>
      </motion.g>
      <polygon points="140,110 160,110 150,130" fill="#64748b" />
      <rect x="120" y="130" width="60" height="10" rx="3" fill="#64748b" />
      {balanced && <motion.text x="150" y="15" textAnchor="middle" fill="#2ecc71" fontSize="11" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Balanced! ✓</motion.text>}
    </svg>
  )
}

function StarReward({ show }) {
  if (!show) return null
  return (
    <motion.svg viewBox="0 0 100 100" width="80" height="80" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}>
      <motion.polygon points="50,5 61,35 95,35 68,55 79,90 50,70 21,90 32,55 5,35 39,35" fill="#f59e0b"
        animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}
      />
      <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900">★</text>
    </motion.svg>
  )
}

// Main component
export default function MathsGames() {
  const toast = useToast()
  const [grade, setGrade] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [problem, setProblem] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showStar, setShowStar] = useState(false)
  const [round, setRound] = useState(0)

  const gradeColor = grade ? GRADES.find(g => g.id === grade)?.color || '#38bdf8' : '#38bdf8'

  const startGame = (gameId) => {
    setActiveGame(gameId)
    setProblem(genProblem(grade))
    setScore(0)
    setStreak(0)
    setRound(0)
  }

  const checkAnswer = (ans) => {
    if (feedback) return
    const correct = ans === problem.answer
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) {
      const pts = 10 + streak * 3
      setScore(s => s + pts)
      setStreak(s => s + 1)
      setShowStar(true)
      setTimeout(() => setShowStar(false), 1000)
    } else {
      setStreak(0)
    }
    setTimeout(() => {
      setFeedback(null)
      setRound(r => r + 1)
      setProblem(genProblem(grade))
    }, 1200)
  }

  // Grade selection screen
  if (!grade) {
    return (
      <div className="mg-full">
        <div className="grade-select-screen">
          <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} style={{ fontSize: '2.5rem', marginBottom: 8 }}>🧠 Maths Brain Games</motion.h1>
          <p style={{ opacity: 0.6, marginBottom: 40, fontSize: '1.1rem' }}>Select your grade to get started!</p>
          <div className="grade-bands">
            {['foundation', 'intermediate', 'senior', 'fet'].map(band => (
              <div key={band} className="band-group">
                <div className="band-label">{band === 'foundation' ? '🌱 Foundation' : band === 'intermediate' ? '📗 Intermediate' : band === 'senior' ? '📘 Senior' : '🎓 FET'}</div>
                <div className="band-grades">
                  {GRADES.filter(g => g.band === band).map(g => (
                    <motion.button key={g.id} className="grade-btn" whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} style={{ background: g.color }} onClick={() => setGrade(g.id)}>
                      {g.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  // Game menu
  if (!activeGame) {
    const g = grade === 'R' ? 0 : parseInt(grade)
    return (
      <div className="mg-full">
        <div className="mg-bar">
          <button className="btn btn-ghost btn-sm" onClick={() => setGrade(null)}>← Change Grade</button>
          <h2 style={{ margin: 0 }}>🧠 Grade {grade} Games</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
        </div>
        <div className="game-menu-center">
          <div className="game-tiles">
            <motion.div className="gtile" whileHover={{ y: -8 }} onClick={() => startGame('battle')} style={{ borderColor: gradeColor }}>
              <svg viewBox="0 0 100 100" width="80" height="80">
                <motion.circle cx="50" cy="50" r="40" fill="none" stroke={gradeColor} strokeWidth="4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} style={{ transformOrigin: '50px 50px' }} />
                <text x="50" y="58" textAnchor="middle" fontSize="30">⚔️</text>
              </svg>
              <h3>Math Battle</h3>
              <p>{g <= 3 ? 'Add & subtract to defeat cute critters!' : g <= 6 ? 'Multiply & divide to fight monsters!' : 'Solve algebra to slay dragons!'}</p>
            </motion.div>

            <motion.div className="gtile" whileHover={{ y: -8 }} onClick={() => startGame('visual')} style={{ borderColor: gradeColor }}>
              <svg viewBox="0 0 100 100" width="80" height="80">
                {[0,1,2,3].map(i => <motion.rect key={i} x={15+i*20} y="30" width="15" height="40" rx="3" fill={gradeColor} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i*0.15 }} />)}
              </svg>
              <h3>Visual Challenge</h3>
              <p>{g <= 3 ? 'Count objects & match shapes!' : g <= 6 ? 'Fractions, decimals & graphs!' : 'Equations, roots & functions!'}</p>
            </motion.div>

            <motion.div className="gtile" whileHover={{ y: -8 }} onClick={() => startGame('speed')} style={{ borderColor: gradeColor }}>
              <svg viewBox="0 0 100 100" width="80" height="80">
                <motion.path d="M50,15 L65,40 L90,45 L72,65 L77,90 L50,77 L23,90 L28,65 L10,45 L35,40 Z" fill={gradeColor} animate={{ scale: [1,1.1,1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ transformOrigin: '50px 50px' }} />
                <text x="50" y="60" textAnchor="middle" fontSize="20" fill="#fff" fontWeight="900">⚡</text>
              </svg>
              <h3>Speed Round</h3>
              <p>Answer as many as you can! Earn combo bonuses for streaks.</p>
            </motion.div>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  // Active game
  const g = grade === 'R' ? 0 : parseInt(grade)
  return (
    <div className="mg-full">
      <div className="mg-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => setActiveGame(null)}>← Games</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span className="hud-pill" style={{ background: gradeColor + '22', color: gradeColor }}>Grade {grade}</span>
          <span className="hud-pill">🍎 {score}</span>
          <span className="hud-pill" style={{ background: streak > 2 ? '#f59e0b22' : undefined }}>🔥 {streak}x</span>
          <span className="hud-pill">Round {round + 1}</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setActiveGame(null)}>End</button>
      </div>

      <div className="game-play-area">
        <AnimatePresence mode="wait">
          <motion.div key={round} className="play-card" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}>
            {/* SVG Visual Aid */}
            <div className="visual-aid">
              {g <= 1 && <CountingScene count={Math.min(problem.answer, 10)} color={gradeColor} />}
              {g >= 2 && g <= 3 && <CountingScene count={Math.min(Math.abs(problem.answer), 10)} color={gradeColor} />}
              {g >= 4 && g <= 6 && <FractionBar numerator={Math.min(problem.answer % 8 + 1, 8)} denominator={8} color={gradeColor} />}
              {g >= 7 && g <= 9 && <AlgebraScale left={problem.answer} right={problem.answer} />}
              {g >= 10 && <AlgebraScale left={problem.answer} right={problem.answer} />}
            </div>

            {/* Problem */}
            <div className="problem-display" style={{ color: gradeColor }}>{problem.text}</div>
            <p style={{ opacity: 0.5, marginBottom: 25 }}>= ?</p>

            {/* Answer Options */}
            <div className="answer-options">
              {problem.options.map((o, i) => (
                <motion.button
                  key={i}
                  className={`ans-btn ${feedback === 'correct' && o === problem.answer ? 'correct' : feedback === 'wrong' && o === problem.answer ? 'reveal' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => checkAnswer(o)}
                  style={{ borderColor: feedback === 'correct' && o === problem.answer ? '#2ecc71' : undefined }}
                >
                  {o}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {feedback === 'correct' && (
              <motion.div className="fb correct" initial={{ y: 10 }} animate={{ y: 0 }}>
                ✅ Correct! +{10 + (streak - 1) * 3}🍎
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div className="fb wrong" initial={{ y: 10 }} animate={{ y: 0 }}>
                ❌ The answer was {problem.answer}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating star reward */}
        <div className="star-float"><StarReward show={showStar} /></div>
      </div>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
.mg-full{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0e1a;color:#fff;z-index:2000;display:flex;flex-direction:column;font-family:system-ui,sans-serif}
.mg-bar{padding:10px 24px;background:#111827;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937}
.hud-pill{background:#1f2937;padding:5px 14px;border-radius:14px;font-weight:700;font-size:.85rem}

.grade-select-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;overflow-y:auto}
.grade-bands{display:flex;flex-direction:column;gap:25px;width:100%;max-width:800px}
.band-group{background:#111827;border-radius:20px;padding:20px 24px}
.band-label{font-weight:700;margin-bottom:12px;font-size:.9rem;opacity:.7}
.band-grades{display:flex;gap:10px;flex-wrap:wrap}
.grade-btn{border:none;color:#000;font-weight:800;padding:12px 20px;border-radius:14px;cursor:pointer;font-size:.95rem;min-width:90px}

.game-menu-center{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}
.game-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:30px;max-width:1000px;width:100%}
.gtile{background:#1a1f2e;border:2px solid #2a3040;border-radius:24px;padding:35px;text-align:center;cursor:pointer;transition:all .3s}
.gtile:hover{box-shadow:0 20px 50px rgba(0,0,0,.4)}
.gtile h3{margin:15px 0 8px}
.gtile p{font-size:.85rem;opacity:.6;margin:0}

.game-play-area{flex:1;display:flex;align-items:center;justify-content:center;position:relative;padding:20px}
.play-card{background:#1a1f2e;border:1px solid #2a3040;border-radius:28px;padding:45px;text-align:center;width:100%;max-width:550px}
.visual-aid{margin-bottom:20px;min-height:80px;display:flex;align-items:center;justify-content:center}
.problem-display{font-size:3rem;font-weight:900;margin-bottom:5px}
.answer-options{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ans-btn{background:#1f2937;border:2px solid #2a3040;color:#fff;padding:18px;border-radius:16px;font-size:1.4rem;font-weight:800;cursor:pointer;transition:all .2s}
.ans-btn:hover{border-color:#38bdf8;background:#2a3040}
.ans-btn.correct{background:#2ecc7122;border-color:#2ecc71}
.ans-btn.reveal{background:#38bdf822;border-color:#38bdf8}
.fb{margin-top:20px;padding:14px;border-radius:14px;font-weight:700;font-size:1rem}
.fb.correct{background:#2ecc7115;color:#2ecc71}
.fb.wrong{background:#e74c3c15;color:#e74c3c}
.star-float{position:absolute;top:30%;right:10%;pointer-events:none}
`
