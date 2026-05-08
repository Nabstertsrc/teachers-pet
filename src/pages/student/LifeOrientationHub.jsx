import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../context/AppContext'

const CAREERS = [
  { title: 'Doctor', icon: '🩺', salary: 'R800k+', study: 'MBChB (6 years)', skills: ['Biology', 'Chemistry', 'Empathy'] },
  { title: 'Software Engineer', icon: '💻', salary: 'R500k+', study: 'BSc CompSci (3-4 years)', skills: ['Maths', 'Logic', 'Problem Solving'] },
  { title: 'Teacher', icon: '📚', salary: 'R250k+', study: 'BEd (4 years)', skills: ['Communication', 'Patience', 'Creativity'] },
  { title: 'Electrician', icon: '⚡', salary: 'R300k+', study: 'N3+ Trade Test', skills: ['Maths', 'Physical Science', 'Practical'] },
  { title: 'Nurse', icon: '💉', salary: 'R350k+', study: 'BCur (4 years)', skills: ['Biology', 'Care', 'Teamwork'] },
  { title: 'Accountant', icon: '📊', salary: 'R450k+', study: 'BCom + CA (7 years)', skills: ['Maths', 'Attention to Detail', 'Ethics'] },
]

const RIGHTS = [
  { right: 'Right to Education', article: 'Section 29', desc: 'Everyone has the right to basic and further education.' },
  { right: 'Right to Equality', article: 'Section 9', desc: 'No one may be unfairly discriminated against.' },
  { right: 'Right to Healthcare', article: 'Section 27', desc: 'Everyone has the right of access to health care services.' },
  { right: 'Right to Dignity', article: 'Section 10', desc: 'Everyone has the right to have their dignity respected.' },
]

const WELLNESS_QUIZ = [
  { q: 'How many hours of sleep should a teenager get?', a: '8-10 hours', options: ['4-5 hours', '6-7 hours', '8-10 hours'] },
  { q: 'Which is the best way to handle exam stress?', a: 'Plan a study schedule and take breaks', options: ['Skip studying entirely', 'Study all night before', 'Plan a study schedule and take breaks'] },
  { q: 'What does peer pressure mean?', a: 'Influence from people your age', options: ['Pressure from teachers', 'Influence from people your age', 'Pressure from parents'] },
]

export default function LifeOrientationHub() {
  const toast = useToast()
  const [tab, setTab] = useState('careers')
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [wellIdx, setWellIdx] = useState(0)
  const [wellScore, setWellScore] = useState(0)
  const [wellFb, setWellFb] = useState(null)

  const checkWell = (ans) => {
    const correct = ans === WELLNESS_QUIZ[wellIdx].a
    setWellFb(correct ? 'correct' : 'wrong')
    if (correct) setWellScore(s => s + 15)
    setTimeout(() => {
      setWellFb(null)
      if (correct) setWellIdx(i => (i + 1) % WELLNESS_QUIZ.length)
    }, 1200)
  }

  return (
    <div className="lab-fullscreen">
      <div className="lab-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🧭</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Life Orientation</h2>
          <select style={{ background: '#1f2937', color: '#fff', border: '1px solid #2a3040', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
            {['R','1','2','3','4','5','6','7','8','9','10','11','12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
        <div className="lab-tabs">
          <button className={`nav-btn ${tab === 'careers' ? 'active' : ''}`} onClick={() => setTab('careers')}>🎯 Career Explorer</button>
          <button className={`nav-btn ${tab === 'rights' ? 'active' : ''}`} onClick={() => setTab('rights')}>⚖️ Bill of Rights</button>
          <button className={`nav-btn ${tab === 'wellness' ? 'active' : ''}`} onClick={() => setTab('wellness')}>💚 Wellness Quiz</button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.history.back()}>Exit</button>
      </div>

      <div className="lab-main">
        {tab === 'careers' && (
          <div className="careers-layout">
            <div className="careers-grid">
              {CAREERS.map((c, i) => (
                <motion.div key={i} className={`career-card ${selectedCareer === i ? 'active' : ''}`} whileHover={{ y: -5 }} onClick={() => setSelectedCareer(i)}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{c.icon}</div>
                  <h3 style={{ margin: '0 0 4px' }}>{c.title}</h3>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{c.salary} / year</div>
                </motion.div>
              ))}
            </div>
            {selectedCareer !== null && (
              <motion.div className="career-detail" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>{CAREERS[selectedCareer].icon}</div>
                <h2>{CAREERS[selectedCareer].title}</h2>
                <div className="detail-row"><span className="detail-label">💰 Salary</span><span>{CAREERS[selectedCareer].salary}</span></div>
                <div className="detail-row"><span className="detail-label">🎓 Study Path</span><span>{CAREERS[selectedCareer].study}</span></div>
                <div className="detail-row"><span className="detail-label">🛠️ Key Skills</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {CAREERS[selectedCareer].skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {tab === 'rights' && (
          <div className="rights-layout">
            <h3 style={{ marginBottom: 25 }}>🇿🇦 South African Bill of Rights</h3>
            <div className="rights-grid">
              {RIGHTS.map((r, i) => (
                <motion.div key={i} className="right-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="right-article">{r.article}</div>
                  <h3 style={{ margin: '10px 0 8px' }}>{r.right}</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === 'wellness' && (
          <div className="game-center">
            <div className="game-card-lg">
              <div className="gc-top"><h3>💚 Wellness & Health</h3><span className="pill">🍎 {wellScore}</span></div>
              <motion.div key={wellIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 30 }}>{WELLNESS_QUIZ[wellIdx].q}</p>
                <div className="opts-col">
                  {WELLNESS_QUIZ[wellIdx].options.map(o => (
                    <motion.button key={o} className="opt-btn" whileTap={{ scale: 0.95 }} onClick={() => !wellFb && checkWell(o)}>{o}</motion.button>
                  ))}
                </div>
              </motion.div>
              {wellFb === 'correct' && <div className="fb-bar correct">✅ Correct! +15🍎</div>}
              {wellFb === 'wrong' && <div className="fb-bar wrong">❌ Not quite!</div>}
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
        .lab-main{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center;padding:20px}
        .game-center{width:100%;max-width:650px}
        .game-card-lg{background:#1a1f2e;border:1px solid #2a3040;border-radius:24px;padding:40px}
        .gc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}
        .pill{background:#1f2937;padding:4px 14px;border-radius:12px;font-size:.85rem}
        .opts-col{display:flex;flex-direction:column;gap:12px}
        .opt-btn{background:#1f2937;border:2px solid #2a3040;color:#fff;padding:16px;border-radius:14px;font-size:1rem;cursor:pointer;transition:all .2s;text-align:left}
        .opt-btn:hover{border-color:#38bdf8}
        .fb-bar{margin-top:20px;padding:14px;border-radius:12px;font-weight:600}
        .fb-bar.correct{background:#2ecc7115;color:#2ecc71}
        .fb-bar.wrong{background:#e74c3c15;color:#e74c3c}
        .careers-layout{display:flex;gap:30px;width:100%;max-width:1000px}
        .careers-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;flex:1}
        .career-card{background:#1a1f2e;border:2px solid #2a3040;border-radius:20px;padding:24px;text-align:center;cursor:pointer;transition:all .3s}
        .career-card:hover{border-color:#38bdf8}
        .career-card.active{border-color:#f59e0b;background:#f59e0b11}
        .career-detail{width:350px;background:#1a1f2e;border:1px solid #2a3040;border-radius:20px;padding:30px}
        .detail-row{display:flex;justify-content:space-between;align-items:flex-start;margin:12px 0;font-size:.9rem;gap:10px}
        .detail-label{opacity:.6;min-width:100px}
        .skill-tag{background:#38bdf822;color:#38bdf8;padding:4px 10px;border-radius:8px;font-size:.75rem;font-weight:600}
        .rights-layout{width:100%;max-width:900px}
        .rights-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .right-card{background:#1a1f2e;border:1px solid #2a3040;border-radius:20px;padding:24px;border-left:4px solid #f59e0b}
        .right-article{font-size:.75rem;color:#f59e0b;font-weight:700}
      `}</style>
    </div>
  )
}
