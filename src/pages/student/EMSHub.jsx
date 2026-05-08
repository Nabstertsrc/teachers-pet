import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const BUDGET_ITEMS = [
  { name: 'Rent', icon: '🏠', cost: 5000, category: 'need' },
  { name: 'Food', icon: '🍞', cost: 2500, category: 'need' },
  { name: 'Transport', icon: '🚌', cost: 1200, category: 'need' },
  { name: 'Electricity', icon: '💡', cost: 800, category: 'need' },
  { name: 'Clothing', icon: '👕', cost: 1000, category: 'want' },
  { name: 'Entertainment', icon: '🎬', cost: 500, category: 'want' },
  { name: 'Savings', icon: '💰', cost: 1500, category: 'saving' },
  { name: 'Phone', icon: '📱', cost: 400, category: 'want' },
]

const BIZ_QUIZ = [
  { q: 'What is the difference between INCOME and PROFIT?', a: 'Profit is income minus expenses', options: ['They are the same', 'Profit is income minus expenses', 'Income is always more'] },
  { q: 'What does VAT stand for?', a: 'Value Added Tax', options: ['Value Added Tax', 'Very Additional Tax', 'Volume And Total'] },
  { q: 'A business sells R10,000 of goods and has R7,000 in costs. What is the profit?', a: 'R3,000', options: ['R10,000', 'R7,000', 'R3,000'] },
  { q: 'Which is a FIXED cost?', a: 'Monthly rent', options: ['Raw materials', 'Monthly rent', 'Commission'] },
]

export default function EMSHub() {
  const toast = useToast()
  const [tab, setTab] = useState('budget')
  const [salary, setSalary] = useState(15000)
  const [selected, setSelected] = useState([])
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFb, setQuizFb] = useState(null)
  const [bizName, setBizName] = useState('')
  const [bizProduct, setBizProduct] = useState('')
  const [bizPrice, setBizPrice] = useState(50)
  const [bizCost, setBizCost] = useState(30)

  const totalSpent = selected.reduce((sum, id) => sum + BUDGET_ITEMS[id].cost, 0)
  const remaining = salary - totalSpent
  const pctUsed = Math.round((totalSpent / salary) * 100)

  const toggleItem = (i) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const checkQuiz = (ans) => {
    const correct = ans === BIZ_QUIZ[quizIdx].a
    setQuizFb(correct ? 'correct' : 'wrong')
    if (correct) setQuizScore(s => s + 15)
    setTimeout(() => {
      setQuizFb(null)
      if (correct) setQuizIdx(i => (i + 1) % BIZ_QUIZ.length)
    }, 1200)
  }

  const bizProfit = bizPrice - bizCost
  const bizMargin = bizPrice > 0 ? Math.round((bizProfit / bizPrice) * 100) : 0

  return (
    <div className="lab-fullscreen">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>💼</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>EMS Hub</h2>
          <select style={{ background: '#1f2937', color: '#fff', border: '1px solid #2a3040', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
            {['7','8','9','10','11','12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
        <div className="lab-tabs">
          <button className={`nav-btn ${tab === 'budget' ? 'active' : ''}`} onClick={() => setTab('budget')}>💰 Budget Sim</button>
          <button className={`nav-btn ${tab === 'business' ? 'active' : ''}`} onClick={() => setTab('business')}>🏪 Business Plan</button>
          <button className={`nav-btn ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>🧠 EMS Quiz</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
      </div>

      <div className="lab-main">
        {tab === 'budget' && (
          <div className="budget-layout">
            <div className="budget-panel">
              <h3>💰 Monthly Budget Simulator</h3>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Monthly Salary</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="range" min="5000" max="40000" step="1000" value={salary} onChange={e => setSalary(parseInt(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>R{salary.toLocaleString()}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Select your expenses:</p>
              <div className="budget-items">
                {BUDGET_ITEMS.map((item, i) => (
                  <motion.div key={i} className={`budget-item ${selected.includes(i) ? 'active' : ''}`} whileTap={{ scale: 0.97 }} onClick={() => toggleItem(i)}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.category}</div>
                    </div>
                    <span style={{ fontWeight: 700 }}>R{item.cost.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="budget-summary">
              <div className="budget-donut">
                <svg viewBox="0 0 120 120" width="200" height="200">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
                  <motion.circle cx="60" cy="60" r="50" fill="none" stroke={remaining >= 0 ? '#2ecc71' : '#e74c3c'} strokeWidth="12" strokeDasharray={`${Math.min(pctUsed, 100) * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" animate={{ strokeDasharray: `${Math.min(pctUsed, 100) * 3.14} 314` }} />
                  <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">{pctUsed}%</text>
                  <text x="60" y="72" textAnchor="middle" fill="#94a3b8" fontSize="9">used</text>
                </svg>
              </div>
              <div className="summary-stats">
                <div className="ss-row"><span>Income</span><span style={{ color: '#2ecc71' }}>R{salary.toLocaleString()}</span></div>
                <div className="ss-row"><span>Expenses</span><span style={{ color: '#e74c3c' }}>R{totalSpent.toLocaleString()}</span></div>
                <div className="ss-row" style={{ borderTop: '1px solid #2a3040', paddingTop: 10 }}>
                  <span style={{ fontWeight: 700 }}>Remaining</span>
                  <span style={{ fontWeight: 700, color: remaining >= 0 ? '#2ecc71' : '#e74c3c' }}>R{remaining.toLocaleString()}</span>
                </div>
              </div>
              {remaining < 0 && <div className="warning-box">⚠️ You are over-budget! Remove some expenses.</div>}
              {remaining > 0 && pctUsed < 80 && <div className="tip-box">💡 Great budgeting! Consider saving more.</div>}
            </div>
          </div>
        )}

        {tab === 'business' && (
          <div className="game-center">
            <div className="game-card-lg">
              <h3>🏪 Mini Business Plan Builder</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: 25 }}>Create a simple business plan and calculate your profit.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input className="form-dark" placeholder="Business Name" value={bizName} onChange={e => setBizName(e.target.value)} />
                <input className="form-dark" placeholder="Product / Service" value={bizProduct} onChange={e => setBizProduct(e.target.value)} />
                <div className="grid-2-ems">
                  <div>
                    <label className="lbl">Selling Price: R{bizPrice}</label>
                    <input type="range" min="10" max="500" value={bizPrice} onChange={e => setBizPrice(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label className="lbl">Cost Price: R{bizCost}</label>
                    <input type="range" min="5" max="400" value={bizCost} onChange={e => setBizCost(parseInt(e.target.value))} />
                  </div>
                </div>
                <div className="profit-display">
                  <div className="profit-box">
                    <span className="profit-label">Profit per item</span>
                    <span className="profit-val" style={{ color: bizProfit > 0 ? '#2ecc71' : '#e74c3c' }}>R{bizProfit}</span>
                  </div>
                  <div className="profit-box">
                    <span className="profit-label">Profit Margin</span>
                    <span className="profit-val" style={{ color: bizMargin > 20 ? '#2ecc71' : '#f59e0b' }}>{bizMargin}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div className="game-center">
            <div className="game-card-lg">
              <div className="gc-top"><h3>🧠 EMS Challenge</h3><span className="pill">🍎 {quizScore}</span></div>
              <motion.div key={quizIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 30 }}>{BIZ_QUIZ[quizIdx].q}</p>
                <div className="opts-col">
                  {BIZ_QUIZ[quizIdx].options.map(o => (
                    <motion.button key={o} className="opt-btn" whileTap={{ scale: 0.95 }} onClick={() => !quizFb && checkQuiz(o)}>{o}</motion.button>
                  ))}
                </div>
              </motion.div>
              {quizFb === 'correct' && <div className="fb-bar correct">✅ Correct! +15🍎</div>}
              {quizFb === 'wrong' && <div className="fb-bar wrong">❌ Not quite. Think again!</div>}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .lab-fullscreen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0e1a;color:#fff;z-index:2000;display:flex;flex-direction:column}
        .lab-hdr{padding:10px 24px;background:#111827;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937}
        .lab-tabs{display:flex;gap:8px}
        .nav-btn{background:none;border:none;color:#94a3b8;padding:8px 14px;cursor:pointer;font-weight:600;font-size:.85rem;transition:all .2s}
        .nav-btn.active{color:#38bdf8;border-bottom:2px solid #38bdf8}
        .lab-main{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center}
        .game-center{width:100%;max-width:650px;padding:20px}
        .game-card-lg{background:#1a1f2e;border:1px solid #2a3040;border-radius:24px;padding:40px}
        .gc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}
        .pill{background:#1f2937;padding:4px 14px;border-radius:12px;font-size:.85rem}
        .opts-col{display:flex;flex-direction:column;gap:12px}
        .opt-btn{background:#1f2937;border:2px solid #2a3040;color:#fff;padding:16px;border-radius:14px;font-size:1rem;cursor:pointer;transition:all .2s;text-align:left}
        .opt-btn:hover{border-color:#38bdf8}
        .fb-bar{margin-top:20px;padding:14px;border-radius:12px;font-weight:600}
        .fb-bar.correct{background:#2ecc7115;color:#2ecc71}
        .fb-bar.wrong{background:#e74c3c15;color:#e74c3c}
        .budget-layout{display:flex;width:100%;height:100%;max-width:1100px;gap:30px;padding:30px}
        .budget-panel{flex:1;overflow-y:auto}
        .budget-items{display:flex;flex-direction:column;gap:10px;margin-top:12px}
        .budget-item{display:flex;align-items:center;gap:14px;background:#1a1f2e;padding:14px 18px;border-radius:14px;border:2px solid #2a3040;cursor:pointer;transition:all .2s}
        .budget-item:hover{border-color:#38bdf8}
        .budget-item.active{border-color:#f59e0b;background:#f59e0b11}
        .budget-summary{width:320px;display:flex;flex-direction:column;align-items:center;gap:20px}
        .summary-stats{width:100%;background:#1a1f2e;padding:20px;border-radius:16px}
        .ss-row{display:flex;justify-content:space-between;margin:8px 0;font-size:.95rem}
        .warning-box{background:#e74c3c15;color:#e74c3c;padding:14px;border-radius:12px;font-weight:600;text-align:center}
        .tip-box{background:#2ecc7115;color:#2ecc71;padding:14px;border-radius:12px;font-weight:600;text-align:center}
        .form-dark{background:#111827;border:2px solid #2a3040;color:#fff;padding:14px;border-radius:12px;font-size:1rem}
        .form-dark:focus{outline:none;border-color:#38bdf8}
        .grid-2-ems{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .lbl{display:block;font-size:.8rem;opacity:.7;margin-bottom:6px}
        .profit-display{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px}
        .profit-box{background:#111827;padding:20px;border-radius:16px;text-align:center}
        .profit-label{display:block;font-size:.8rem;opacity:.6;margin-bottom:6px}
        .profit-val{font-size:2rem;font-weight:900}
      `}</style>
    </div>
  )
}
