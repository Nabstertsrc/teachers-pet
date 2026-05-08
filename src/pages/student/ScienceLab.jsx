import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const ELEMENTS = [
  { id: 'na', name: 'Sodium (Na)', color: '#C0C0C0', type: 'metal' },
  { id: 'h2o', name: 'Water (H2O)', color: '#3498db', type: 'liquid' },
  { id: 'hcl', name: 'Acid (HCl)', color: '#e74c3c', type: 'acid' },
  { id: 'naoh', name: 'Base (NaOH)', color: '#2ecc71', type: 'base' },
  { id: 'bs', name: 'Baking Soda', color: '#ecf0f1', type: 'powder' },
  { id: 'vn', name: 'Vinegar', color: '#f1c40f', type: 'liquid' },
]

const REACTIONS = {
  'na+h2o': { title: '🔥 Chemical Reaction!', desc: 'Sodium reacts violently with water to form Sodium Hydroxide and Hydrogen gas.', animation: 'explosion' },
  'hcl+naoh': { title: '🧂 Neutralization!', desc: 'Acid and Base mix to form Salt and Water.', animation: 'steam' },
  'bs+vn': { title: '🫧 Fizzing!', desc: 'Baking soda and vinegar react to produce Carbon Dioxide gas (bubbles).', animation: 'bubbles' },
}

export default function ScienceLab() {
  const toast = useToast()
  const [beaker, setBeaker] = useState([])
  const [reaction, setReaction] = useState(null)

  const addToBeaker = (el) => {
    if (beaker.length >= 2) {
      toast('Beaker is full! Empty it first.', 'warning')
      return
    }
    if (beaker.find(item => item.id === el.id)) return
    
    const newBeaker = [...beaker, el]
    setBeaker(newBeaker)

    if (newBeaker.length === 2) {
      const key1 = `${newBeaker[0].id}+${newBeaker[1].id}`
      const key2 = `${newBeaker[1].id}+${newBeaker[0].id}`
      const res = REACTIONS[key1] || REACTIONS[key2]
      
      if (res) {
        setTimeout(() => setReaction(res), 500)
      } else {
        setTimeout(() => toast('No significant reaction detected.', 'info'), 500)
      }
    }
  }

  const reset = () => {
    setBeaker([])
    setReaction(null)
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚗️ Interactive Science Lab</h1>
          <p className="page-subtitle">Experiment with elements, witness reactions, and explore atoms.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>🧪 Virtual Experiment</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Select two elements to mix them in the beaker and observe the chemical reaction.
          </p>
          
          <div className="grid-3" style={{ gap: 10 }}>
            {ELEMENTS.map(el => (
              <button 
                key={el.id} 
                className={`btn btn-ghost ${beaker.find(b => b.id === el.id) ? 'active' : ''}`}
                onClick={() => addToBeaker(el)}
                style={{ height: 'auto', padding: '12px 8px', fontSize: '0.8rem' }}
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: el.color, margin: '0 auto 6px' }} />
                {el.name}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 20 }} onClick={reset}>
            🧹 Empty Beaker
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          <AnimatePresence>
            {!reaction ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Visual Beaker */}
                <div className="beaker-container">
                  <div className="beaker">
                    <div className="beaker-liquid" style={{ 
                      height: beaker.length === 0 ? '0%' : beaker.length === 1 ? '30%' : '60%',
                      background: beaker.length > 0 ? beaker[0].color : 'transparent'
                    }} />
                    {beaker.length === 2 && (
                       <div className="beaker-liquid" style={{ 
                        height: '30%',
                        bottom: '30%',
                        background: beaker[1].color,
                        opacity: 0.7
                      }} />
                    )}
                  </div>
                </div>
                <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>
                  {beaker.length === 0 ? 'Beaker is empty' : beaker.length === 1 ? 'Waiting for second element...' : 'Mixing...'}
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="reaction-result">
                {reaction.animation === 'explosion' && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    style={{ fontSize: '5rem', marginBottom: 20 }}
                  >
                    💥
                  </motion.div>
                )}
                {reaction.animation === 'bubbles' && (
                  <div className="bubbles-container">
                    {[1,2,3,4,5].map(i => (
                      <motion.div key={i} className="bubble" animate={{ y: [-20, -100], opacity: [1, 0] }} transition={{ repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                    <div style={{ fontSize: '5rem' }}>🫧</div>
                  </div>
                )}
                {reaction.animation === 'steam' && (
                  <motion.div animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -10] }} transition={{ repeat: Infinity }} style={{ fontSize: '5rem' }}>
                    💨
                  </motion.div>
                )}
                <h2>{reaction.title}</h2>
                <p style={{ padding: '0 20px', marginTop: 10 }}>{reaction.desc}</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={reset}>Try Another</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 30 }}>
        <div className="card">
          <h3>⚛️ Atom Explorer</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visualize atomic structures of elements.</p>
          <div className="atom-viz">
            <div className="nucleus" />
            <motion.div className="electron" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
            <motion.div className="electron" style={{ width: 80, height: 80 }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
          </div>
        </div>
        <div className="card">
          <h3>🧬 Biology Hub</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lessons on cells, DNA, and ecosystems.</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Open Biology Portal</button>
        </div>
        <div className="card">
          <h3>🔭 Space & Earth</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Explore the solar system and geology.</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Open Space Hub</button>
        </div>
      </div>

      <style>{`
        .beaker-container { width: 120px; height: 160px; margin: 0 auto; position: relative; }
        .beaker { 
          width: 100px; height: 140px; border: 4px solid var(--text); border-top: none; 
          border-radius: 0 0 20px 20px; position: relative; overflow: hidden; margin: 0 auto;
          background: rgba(255,255,255,0.1);
        }
        .beaker::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 10px;
          border: 4px solid var(--text); border-radius: 50%; transform: translateY(-50%);
        }
        .beaker-liquid { position: absolute; bottom: 0; left: 0; right: 0; transition: all 0.5s ease; }
        .bubbles-container { position: relative; height: 100px; margin-bottom: 20px; }
        .bubble { 
          position: absolute; width: 10px; height: 10px; background: rgba(255,255,255,0.5); 
          border-radius: 50%; left: 50%; 
        }
        .atom-viz { height: 150px; position: relative; display: flex; align-items: center; justify-content: center; margin-top: 20px; }
        .nucleus { width: 20px; height: 20px; background: var(--accent); border-radius: 50%; z-index: 2; box-shadow: 0 0 15px var(--accent); }
        .electron { 
          position: absolute; width: 60px; height: 60px; border: 1px solid var(--primary); 
          border-radius: 50%; 
        }
        .electron::after {
          content: ''; position: absolute; top: -4px; left: 50%; width: 8px; height: 8px; 
          background: var(--primary); border-radius: 50%; transform: translateX(-50%);
        }
      `}</style>
    </div>
  )
}
