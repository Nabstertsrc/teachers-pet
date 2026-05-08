import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/AppContext'
import { predictReaction, generateMathTutorial } from '../../lib/gemini'

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

export default function ScienceLab() {
  const toast = useToast()
  const [tab, setTab] = useState('experiment')
  const [beakers, setBeakers] = useState([{ id: 1, elements: [] }, { id: 2, elements: [] }])
  const [activeBeaker, setActiveBeaker] = useState(1)
  const [reaction, setReaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedAtom, setSelectedAtom] = useState('H')

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
      const elNames = allElements.map(e => e.name).join(' and ')
      const resText = await predictReaction(allElements[0].name, allElements[1].name)
      
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
          <button className={`nav-btn ${tab === 'biology' ? 'active' : ''}`} onClick={() => setTab('biology')}>🧬 Biology</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit Lab</button>
      </div>

      <div className="lab-content">
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
      `}</style>
    </div>
  )
}
