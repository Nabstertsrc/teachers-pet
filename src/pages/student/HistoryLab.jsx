import { useState, useEffect, useMemo } from 'react'
import { motion, Reorder } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { db } from '../../lib/db'
import { generateLabContent } from '../../lib/gemini'
import { getAdaptivePlan, recordAdaptiveResult } from '../../lib/adaptivePlanner'

export default function HistoryLab() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [originalOrder, setOriginalOrder] = useState([])
  const [solved, setSolved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sourceFeedback, setSourceFeedback] = useState('')
  const [planTick, setPlanTick] = useState(0)
  const grade = 10 // Mock grade selection, can be dynamic later
  const adaptivePlan = useMemo(() => getAdaptivePlan('history', String(grade)), [planTick])

  useEffect(() => {
    async function loadContent() {
      setLoading(true)
      try {
        // Check local cache
        const cached = await db.lab_content.where({ labType: 'history_timeline', grade }).first()
        let events = []
        
        if (cached && cached.content) {
          events = cached.content
        } else {
          // Generate via AI
          toast('Generating new History timeline...', 'info')
          events = await generateLabContent('history_timeline', grade)
          if (events && events.length > 0) {
            await db.lab_content.add({
              labType: 'history_timeline',
              grade,
              content: events,
              generatedAt: new Date().toISOString()
            })
          }
        }
        
        if (events && events.length > 0) {
          // Sort chronologically for validation
          const sorted = [...events].sort((a, b) => a.year - b.year)
          setOriginalOrder(sorted)
          // Shuffle for the game
          setItems([...events].sort(() => Math.random() - 0.5))
        }
      } catch (err) {
        console.error(err)
        toast('Failed to load timeline.', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [grade, toast])

  const checkOrder = () => {
    const isCorrect = items.every((item, i) => item.year === originalOrder[i].year)
    if (isCorrect) {
      setSolved(true)
      toast('Correct Timeline! +50🍎', 'success')
    } else {
      toast('Not quite right. Try again!', 'error')
    }
    recordAdaptiveResult('history', String(grade), isCorrect)
    setPlanTick((v) => v + 1)
  }

  return (
    <div className="lab-fullscreen animate-fade">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>⏳</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>History Lab (CAPS)</h2>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Hub</button>
      </div>

      <div className="lab-main">
        <div className="adaptive-banner">
          Adaptive Plan: {adaptivePlan.level} | Mastery {adaptivePlan.mastery}% | {adaptivePlan.objective}
        </div>
        <div className="history-grid">
          <div className="card" style={{ width: '100%' }}>
            <h3>🇿🇦 South African History Timeline</h3>
            <p style={{ opacity: 0.7, marginBottom: 20 }}>Drag the events into the correct chronological order from top to bottom.</p>
            
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <div className="loading-text">Generating Dynamic Timeline...</div>
              </div>
            ) : (
              <Reorder.Group axis="y" values={items} onReorder={setItems} className="timeline-list">
              {items.map(item => (
                <Reorder.Item key={item.id} value={item} className={`timeline-item ${solved ? 'solved' : ''}`}>
                  <div className="year-tag">{solved ? item.year : '?'}</div>
                  <div className="event-desc">{item.event}</div>
                  <div className="drag-handle">☰</div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            )}

            <div style={{ marginTop: 22, textAlign: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={checkOrder} disabled={solved}>
                {solved ? 'Timeline Completed! ✅' : 'Check Timeline ⚡'}
              </button>
              {solved && (
                <button
                  className="btn btn-ghost"
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    setItems([...originalOrder].sort(() => Math.random() - 0.5))
                    setSolved(false)
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="card" style={{ width: '100%' }}>
            <h3>🎓 Curriculum Studio: Source Analysis</h3>
            <svg viewBox="0 0 360 200" width="100%" height="200" aria-label="Chronology animation">
              <rect x="0" y="0" width="360" height="200" fill="#111827" rx="12" />
              <line x1="30" y1="120" x2="330" y2="120" stroke="#64748b" strokeWidth="3" />
              {[0,1,2,3].map((i) => (
                <circle key={i} cx={60 + i * 80} cy="120" r="8" fill="#38bdf8">
                  <animate attributeName="r" values="8;13;8" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              ))}
              <text x="28" y="90" fill="#cbd5e1" fontSize="12">Cause</text>
              <text x="156" y="90" fill="#cbd5e1" fontSize="12">Turning point</text>
              <text x="286" y="90" fill="#cbd5e1" fontSize="12">Effect</text>
            </svg>
            <p style={{ opacity: 0.8 }}>
              Historical reasoning structure: <strong>Claim + Evidence + Context + Reliability</strong>.
            </p>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>Which source is usually strongest for date accuracy?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Official census record', 'Rumor in a diary', 'Second-hand speech'].map((opt) => (
                <button
                  key={opt}
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const correct = opt === 'Official census record'
                    setSourceFeedback(correct ? '✅ Correct: official records are primary evidence for dates.' : '❌ Check source reliability and proximity to the event.')
                    recordAdaptiveResult('history', String(grade), correct)
                    setPlanTick((v) => v + 1)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {sourceFeedback && <p style={{ marginTop: 10 }}>{sourceFeedback}</p>}
          </div>
        </div>
      </div>

      <style>{`
        .lab-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0e1a; color: white; z-index: 2000; display: flex; flex-direction: column; }
        .lab-hdr { padding: 12px 24px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; }
        .lab-main { flex: 1; overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .adaptive-banner { position: fixed; top: 70px; left: 50%; transform: translateX(-50%); z-index: 5; background: #1e293b; border: 1px solid #334155; border-radius: 999px; padding: 6px 12px; font-size: 0.8rem; }
        .history-grid { width: min(1200px, 100%); display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 18px; }
        
        .timeline-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .timeline-item { 
          background: #1e293b; border: 1px solid #334155; padding: 15px 20px; 
          border-radius: 12px; display: flex; align-items: center; gap: 20px; 
          cursor: grab; transition: all 0.2s;
        }
        .timeline-item:active { cursor: grabbing; border-color: #38bdf8; }
        .timeline-item.solved { border-color: #2ecc71; background: rgba(46, 204, 113, 0.1); }
        
        .year-tag { 
          width: 80px; background: #334155; padding: 5px; border-radius: 6px; 
          text-align: center; font-weight: 800; color: #38bdf8;
        }
        .event-desc { flex: 1; font-size: 0.95rem; }
        .drag-handle { opacity: 0.3; font-size: 1.2rem; }
        @media (max-width: 980px) {
          .history-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
