import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { db } from '../../lib/db'
import { generateLabContent } from '../../lib/gemini'

export default function HistoryLab() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [originalOrder, setOriginalOrder] = useState([])
  const [solved, setSolved] = useState(false)
  const [loading, setLoading] = useState(true)
  const grade = 10 // Mock grade selection, can be dynamic later

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
        <div className="card" style={{ maxWidth: 800, width: '100%' }}>
          <h3>🇿🇦 South African History Timeline</h3>
          <p style={{ opacity: 0.7, marginBottom: 30 }}>Drag the events into the correct chronological order from top to bottom.</p>
          
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

          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={checkOrder} disabled={solved}>
              {solved ? 'Timeline Completed! ✅' : 'Check Timeline ⚡'}
            </button>
            {solved && (
              <button className="btn btn-ghost" style={{ marginLeft: 15 }} onClick={() => {setItems([...HISTORICAL_EVENTS].sort(() => Math.random() - 0.5)); setSolved(false)}}>Reset</button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .lab-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0e1a; color: white; z-index: 2000; display: flex; flex-direction: column; }
        .lab-hdr { padding: 12px 24px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; }
        .lab-main { flex: 1; overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 40px; }
        
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
      `}</style>
    </div>
  )
}
