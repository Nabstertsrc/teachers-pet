import { useEffect, useMemo, useState } from 'react'
import { solveMathProblem, generateMathTutorial } from '../../lib/gemini'
import { useToast } from '../../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getAdaptivePlan, recordAdaptiveResult } from '../../lib/adaptivePlanner'
import 'katex/dist/katex.min.css'

const FORMULAS = {
  square: String.raw`$A = s^2$`,
  circle: String.raw`$A = \pi r^2$`,
  triangle: String.raw`$A = \frac{1}{2} b h$`,
  quadratic: String.raw`$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`
}

const LESSON_STEPS = [
  {
    title: 'Represent The Problem',
    explain: 'Translate words into symbols. If distance is constant, model with d = rt.',
    equation: String.raw`d = r \times t`,
  },
  {
    title: 'Pick A Strategy',
    explain: 'Choose substitution, factorization, or graphing based on what is asked.',
    equation: String.raw`y = mx + c`,
  },
  {
    title: 'Check Reasonableness',
    explain: 'Estimate first. Your exact answer should match the scale of the estimate.',
    equation: String.raw`\text{error} = \left|\text{exact} - \text{estimate}\right|`,
  },
]

export default function MathsLab() {
  const toast = useToast()
  const [tab, setTab] = useState('solve')
  const [generating, setGenerating] = useState(false)
  const [problem, setProblem] = useState('')
  const [grade, setGrade] = useState('10')
  const [result, setResult] = useState('')
  const [lessonStep, setLessonStep] = useState(0)
  const [equationChoice, setEquationChoice] = useState('')
  const [equationFeedback, setEquationFeedback] = useState('')
  const [planTick, setPlanTick] = useState(0)
  const adaptivePlan = useMemo(() => getAdaptivePlan('maths', grade), [grade, planTick])

  useEffect(() => {
    setLessonStep(0)
    setEquationChoice('')
    setEquationFeedback('')
  }, [grade])

  const handleSolve = async () => {
    if (!problem.trim()) return
    setGenerating(true)
    try {
      const res = await solveMathProblem(problem, grade)
      setResult(res)
      toast('Solution generated! 🧠', 'success')
    } catch {
      toast('Failed to solve problem', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleLearn = async (topic) => {
    const cacheKey = `maths-tutorial:${grade}:${topic.toLowerCase()}`
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
    if (cached) {
      setResult(cached)
      setTab('learn')
      toast(`Loaded cached tutorial for ${topic} ✅`, 'success')
      return
    }
    setGenerating(true)
    setTab('learn')
    try {
      const res = await generateMathTutorial(topic, grade)
      setResult(res)
      if (typeof window !== 'undefined') localStorage.setItem(cacheKey, res)
      toast(`Tutorial for ${topic} is ready! ✨`, 'success')
    } catch {
      toast('Failed to generate tutorial', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📐 AI Maths Lab</h1>
          <p className="page-subtitle">Scan, solve, and master mathematics with interactive AI tools.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="form-input" value={grade} onChange={e => setGrade(e.target.value)} style={{ width: 120 }}>
            <option value="R">Grade R</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'solve' ? 'active' : ''}`} onClick={() => setTab('solve')}>🔍 Solve & Explain</button>
        <button className={`tab ${tab === 'learn' ? 'active' : ''}`} onClick={() => setTab('learn')}>📖 Interactive Classes</button>
        <button className={`tab ${tab === 'studio' ? 'active' : ''}`} onClick={() => setTab('studio')}>🧠 Curriculum Studio</button>
        <button className={`tab ${tab === 'formulas' ? 'active' : ''}`} onClick={() => setTab('formulas')}>🧪 Formula Bank</button>
        <button className={`tab ${tab === 'tips' ? 'active' : ''}`} onClick={() => setTab('tips')}>💡 Study Tips</button>
      </div>
      <div className="card-glass" style={{ padding: 12, marginBottom: 12 }}>
        <strong>Adaptive Plan:</strong> Level {adaptivePlan.level} | Mastery {adaptivePlan.mastery}% | Streak {adaptivePlan.streak}
        <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
          {adaptivePlan.objective} | Pace: {adaptivePlan.pacing}
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="space-y-4">
          {tab === 'solve' && (
            <div className="card">
              <h3>🔢 Scan to Solve</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Paste a math problem or describe it. We'll show you how to solve it step-by-step.
              </p>
              <textarea 
                className="form-textarea" 
                rows={6} 
                placeholder="e.g. Solve for x: 2x + 5 = 15 or 'What is the area of a circle with radius 5?'" 
                value={problem}
                onChange={e => setProblem(e.target.value)}
              />
              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleSolve} disabled={generating}>
                  {generating ? '✨ Calculating...' : '⚡ Solve & Explain'}
                </button>
                <label className="btn btn-secondary btn-lg" style={{ cursor: 'pointer' }}>
                  📷 Scan
                  <input type="file" hidden accept="image/*" onChange={() => toast('Image scanning feature coming soon!', 'info')} />
                </label>
              </div>
            </div>
          )}

          {tab === 'learn' && (
            <div className="card">
              <h3>🎒 Interactive Maths Classes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Choose a topic for Grade {grade} to start an AI-powered interactive lesson.
              </p>
              <div className="grid-2" style={{ gap: 10 }}>
                {grade === 'R' || parseInt(grade) <= 3 ? (
                  ['Counting', 'Addition (+)', 'Subtraction (-)', 'Shapes', 'Patterns'].map(t => (
                    <button key={t} className="btn btn-ghost btn-sm" onClick={() => handleLearn(t)}>{t}</button>
                  ))
                ) : parseInt(grade) <= 7 ? (
                  ['Fractions', 'Decimals', 'Long Division', 'Area & Perimeter', 'Graphs'].map(t => (
                    <button key={t} className="btn btn-ghost btn-sm" onClick={() => handleLearn(t)}>{t}</button>
                  ))
                ) : (
                  ['Algebra', 'Trigonometry', 'Calculus', 'Probability', 'Analytical Geometry'].map(t => (
                    <button key={t} className="btn btn-ghost btn-sm" onClick={() => handleLearn(t)}>{t}</button>
                  ))
                )}
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <input className="form-input" placeholder="Or type any topic..." onKeyDown={e => e.key === 'Enter' && handleLearn(e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'formulas' && (
            <div className="card">
              <h3>🧪 Formula Generator</h3>
              <div className="space-y-4">
                  <div className="card-glass" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>Geometry (Area)</div>
                    <div style={{ fontSize: '0.9rem' }}>Square: {FORMULAS.square}</div>
                    <div style={{ fontSize: '0.9rem' }}>Circle: {FORMULAS.circle}</div>
                    <div style={{ fontSize: '0.9rem' }}>Triangle: {FORMULAS.triangle}</div>
                  </div>
                  <div className="card-glass" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>Algebra</div>
                    <div style={{ fontSize: '0.9rem' }}>Quadratic: {FORMULAS.quadratic}</div>
                  </div>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => handleLearn('Essential Formulas')}>Generate Custom Formula Sheet</button>
              </div>
            </div>
          )}

          {tab === 'studio' && (
            <div className="card">
              <h3>🧠 Advanced Lesson Studio</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Grade-aware mini-lesson: model, solve, and verify with equations and visual interpretation.
              </p>

              <div className="card-glass" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Step {lessonStep + 1}: {LESSON_STEPS[lessonStep].title}
                </div>
                <div style={{ fontSize: '0.95rem', marginBottom: 8 }}>{LESSON_STEPS[lessonStep].explain}</div>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {`$${LESSON_STEPS[lessonStep].equation}$`}
                </ReactMarkdown>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => setLessonStep((prev) => Math.min(LESSON_STEPS.length - 1, prev + 1))}
                  disabled={lessonStep >= LESSON_STEPS.length - 1}
                >
                  {lessonStep >= LESSON_STEPS.length - 1 ? 'Lesson Complete' : 'Next Teaching Step'}
                </button>
              </div>

              <div className="card-glass" style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Equation Checkpoint</div>
                <div style={{ fontSize: '0.9rem', marginBottom: 10 }}>
                  If the line passes through (0,2) and (3,8), which equation is correct?
                </div>
                <div className="grid-2" style={{ gap: 8 }}>
                  {['y = 2x + 2', 'y = x + 2', 'y = 3x + 8', 'y = 2x - 2'].map((opt) => (
                    <button
                      key={opt}
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const correct = opt === 'y = 2x + 2'
                        setEquationChoice(opt)
                        setEquationFeedback(correct ? 'Correct: slope is 2 and intercept is 2.' : 'Try again: compute slope (8-2)/(3-0).')
                        recordAdaptiveResult('maths', grade, correct)
                        setPlanTick((v) => v + 1)
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {equationChoice && (
                  <p style={{ marginTop: 10, fontSize: '0.9rem' }}>{equationFeedback}</p>
                )}
              </div>
            </div>
          )}

          {tab === 'tips' && (
            <div className="card">
              <h3>💡 Ways to Tackle Maths</h3>
              <ul style={{ paddingLeft: 20, fontSize: '0.9rem', lineHeight: 1.8 }}>
                <li><strong>Understand the "Why":</strong> Don't just memorize formulas; understand why they work.</li>
                <li><strong>Practice Daily:</strong> Maths is a muscle. Do 3 problems every single day.</li>
                <li><strong>Draw it Out:</strong> Use diagrams for word problems. If you can see it, you can solve it.</li>
                <li><strong>Master the Basics:</strong> Complex algebra is just simple arithmetic in disguise.</li>
                <li><strong>Use the AI Explainer:</strong> Use this tool to see the steps you missed.</li>
              </ul>
            </div>
          )}
        </div>

        <div>
          {tab === 'studio' && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>📈 Animated SVG Concept Board</h3>
              <svg viewBox="0 0 420 240" width="100%" height="240" role="img" aria-label="Linear graph explainer">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
                    <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8" />
                  </marker>
                </defs>
                <rect x="0" y="0" width="420" height="240" fill="rgba(148,163,184,0.08)" rx="12" />
                <line x1="40" y1="200" x2="390" y2="200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="40" y1="200" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="40" y1="160" x2="340" y2="40" stroke="#38bdf8" strokeWidth="4">
                  <animate attributeName="stroke-dasharray" values="0,500;500,0" dur="2.2s" repeatCount="indefinite" />
                </line>
                <circle cx="40" cy="160" r="6" fill="#22c55e" />
                <circle cx="220" cy="88" r="6" fill="#22c55e" />
                <text x="50" y="154" fontSize="12" fill="currentColor">(0,2)</text>
                <text x="228" y="84" fontSize="12" fill="currentColor">(3,8)</text>
                <text x="262" y="52" fontSize="13" fill="currentColor">y = 2x + 2</text>
              </svg>
              <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                The animation traces the line repeatedly so learners can connect slope, intercept, and coordinate movement.
              </p>
            </div>
          )}

          {!result && !generating && (
            <div className="card" style={{ border: '2px dashed var(--border-light)', textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
              <h3>Results & Tutorials</h3>
              <p style={{ color: 'var(--text-muted)' }}>Solutions and interactive lessons will appear here.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>AI Tutor is thinking...</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up">
              <div className="markdown-content maths-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {result}
                </ReactMarkdown>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 20 }} onClick={() => {
                navigator.clipboard.writeText(result)
                toast('Copied to clipboard!', 'success')
              }}>📋 Copy Content</button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .maths-content { font-size: 1rem; line-height: 1.6; }
        .maths-content h1, .maths-content h2 { color: var(--primary); margin-top: 20px; }
        .maths-content p { margin-bottom: 12px; }
        .maths-content code { background: var(--bg-surface); padding: 2px 6px; border-radius: 4px; }
      `}</style>
    </div>
  )
}
