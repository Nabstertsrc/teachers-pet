import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLessons, getQuestionPapers, getTodos, getAnnualPlans, getSettings, getSchoolProfile, saveSchoolProfile } from '../lib/storage'
import { generateMotivationalQuote } from '../lib/gemini'

const QUICK_ACTIONS = [
  { icon: '📚', label: 'New Lesson', desc: 'Generate a lesson plan', path: '/lessons', color: '#6C63FF' },
  { icon: '📝', label: 'Question Paper', desc: 'Build an exam paper', path: '/question-paper', color: '#FF6B6B' },
  { icon: '📅', label: 'Annual Plan', desc: 'Create teaching plan', path: '/annual-plan', color: '#00D9C4' },
  { icon: '📊', label: 'Gradebook', desc: 'Track learner marks', path: '/gradebook', color: '#4ECDC4' },
  { icon: '📝', label: 'Attendance', desc: 'Daily class register', path: '/attendance', color: '#FFB347' },
  { icon: '📏', label: 'Rubric Builder', desc: 'Marking guides', path: '/rubric', color: '#B39DDB' },
  { icon: '📜', label: 'Report Cards', desc: 'Write AI comments', path: '/report-card', color: '#9CCC65' },
  { icon: '🎓', label: 'Student Portal', desc: 'Study guides & notes', path: '/student', color: '#64B5F6' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [quote, setQuote] = useState('')
  const [quoteLoading, setQuoteLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const [papers, setPapers] = useState([])
  const [todos, setTodos] = useState([])
  const [plans, setPlans] = useState([])
  const [settings, setSettings] = useState({})
  const [school, setSchool] = useState(null)
  const [showSchoolForm, setShowSchoolForm] = useState(false)
  const pendingTodos = todos.filter(t => !t.completed)
  const now = new Date()

  useEffect(() => {
    const load = async () => {
      const [l, p, t, pl, s, sch] = await Promise.all([
        getLessons(),
        getQuestionPapers(),
        getTodos(),
        getAnnualPlans(),
        getSettings(),
        getSchoolProfile()
      ])
      setLessons(l)
      setPapers(p)
      setTodos(t)
      setPlans(pl)
      setSettings(s)
      setSchool(sch)
    }
    load()
  }, [])

  useEffect(() => {
    generateMotivationalQuote()
      .then(setQuote)
      .catch(() => setQuote('"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela'))
      .finally(() => setQuoteLoading(false))
  }, [])

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-wrapper animate-fade">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div>
          <h1 className="page-title">{greeting}{settings.teacherName ? `, ${settings.teacherName}` : ''} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
            {now.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="quote-card card-glass">
          {quoteLoading
            ? <div className="generating-dots"><span/><span/><span/></div>
            : <p style={{ color: 'var(--text)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.6 }}>{quote}</p>
          }
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: '📚', value: lessons.length, label: 'Lessons Created', color: '#6C63FF' },
          { icon: '📝', value: papers.length, label: 'Question Papers', color: '#FF6B6B' },
          { icon: '📅', value: plans.length, label: 'Annual Plans', color: '#00D9C4' },
          { icon: '✅', value: pendingTodos.length, label: 'Pending Tasks', color: '#FFB347' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: 16, fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quick Actions</h2>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <button key={i} className="quick-action-card" onClick={() => navigate(a.path)} style={{ '--card-color': a.color }}>
            <span className="qa-icon">{a.icon}</span>
            <div>
              <div className="qa-label">{a.label}</div>
              <div className="qa-desc">{a.desc}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: a.color, opacity: 0.7 }}>›</span>
          </button>
        ))}
      </div>

      {/* Recent & Todo */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* School Profile Card */}
        <div className="card school-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {school?.logo ? <img src={school.logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'contain', background: '#f5f5f5' }} /> : <div className="qa-icon">🏫</div>}
              <div>
                <h3 style={{ margin: 0 }}>{school?.name || 'School Profile'}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{school?.name ? 'Registered & active on official docs' : 'Not registered yet'}</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowSchoolForm(!showSchoolForm)}>
              {showSchoolForm ? 'Close' : school?.name ? 'Edit Profile' : 'Register School'}
            </button>
          </div>

          {showSchoolForm && (
            <div className="school-form animate-slide-down">
              <div className="grid-2">
                <div className="form-group">
                  <label>School Name</label>
                  <input type="text" className="form-control" value={school?.name || ''} onChange={e => setSchool({...school, name: e.target.value})} placeholder="e.g. Westview High" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" value={school?.email || ''} onChange={e => setSchool({...school, email: e.target.value})} placeholder="school@example.com" />
                </div>
                <div className="form-group">
                  <label>Physical Address</label>
                  <input type="text" className="form-control" value={school?.address || ''} onChange={e => setSchool({...school, address: e.target.value})} placeholder="123 Education Way" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" value={school?.phone || ''} onChange={e => setSchool({...school, phone: e.target.value})} placeholder="+27 12 345 6789" />
                </div>
                <div className="form-group">
                  <label>School Logo / Letterhead Banner</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Tip: Upload a full-width image (approx. 1200x250px) to use as an official letterhead.</p>
                  <input type="file" accept="image/*" className="form-control" onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => setSchool({...school, logo: reader.result})
                      reader.readAsDataURL(file)
                    }
                  }} />
                </div>
                <div className="form-group">
                  <label>Class Register (Students List)</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Upload a .txt or .csv with one student name per line.</p>
                  <input type="file" accept=".csv,.txt" className="form-control" onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        const register = ev.target.result.split('\n').filter(l => l.trim()).map(l => ({ name: l.trim(), id: Math.random().toString(36).substr(2, 9) }))
                        setSchool({...school, register})
                        alert(`Imported ${register.length} students!`)
                      }
                      reader.readAsText(file)
                    }
                  }} />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" onClick={async () => {
                  await saveSchoolProfile(school)
                  setShowSchoolForm(false)
                }}>Save Changes</button>
                {school?.register?.length > 0 && <span className="badge badge-success" style={{ alignSelf: 'center' }}>{school.register.length} Students Loaded</span>}
              </div>
            </div>
          )}
        </div>

        {/* Recent Lessons */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>📚 Recent Lessons</h3>
          {lessons.length === 0
            ? <div className="empty-state" style={{ padding: 24 }}><div className="empty-state-icon">📚</div><p>No lessons yet</p><button className="btn btn-primary btn-sm" onClick={() => navigate('/lessons')}>Create First Lesson</button></div>
            : lessons.slice(0, 4).map(l => (
              <div key={l.id} className="list-item" onClick={() => navigate('/lessons')}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.title || l.topic}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{l.subject} · Grade {l.grade} · {new Date(l.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-primary">{l.subject}</span>
              </div>
            ))
          }
        </div>

        {/* Pending Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>✅ Pending Tasks</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/todo')}>View All</button>
          </div>
          {pendingTodos.length === 0
            ? <div className="empty-state" style={{ padding: 24 }}><div className="empty-state-icon">✅</div><p>All caught up!</p></div>
            : pendingTodos.slice(0, 5).map(t => (
              <div key={t.id} className="list-item">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.priority === 'high' ? 'var(--accent)' : t.priority === 'medium' ? 'var(--warning)' : 'var(--success)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{t.title}</div>
                  {t.dueDate && <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
                </div>
                {t.priority && <span className={`badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-success'}`}>{t.priority}</span>}
              </div>
            ))
          }
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={() => navigate('/todo')}>+ Add Task</button>
        </div>
      </div>

      <style>{`
        .dashboard-hero { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:28px; flex-wrap:wrap; }
        .quote-card { padding:16px 20px; max-width:400px; flex:1; min-width:200px; border-left: 4px solid var(--primary); }
        .quick-action-card {
          display:flex; align-items:center; gap:16px;
          background:var(--bg-card); border:1px solid var(--border);
          border-radius:var(--radius); padding:16px 20px;
          cursor:pointer; transition:all var(--transition); text-align:left; width:100%;
        }
        .quick-action-card:hover { border-color:var(--card-color); transform:translateY(-2px); box-shadow:var(--shadow-lg); background:var(--bg-surface); }
        .qa-icon { font-size:1.6rem; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:var(--bg-surface); border-radius:4px; }
        .qa-label { font-weight:600; font-family:var(--font-body); font-size:0.95rem; color:var(--text); }
        .qa-desc { font-size:0.78rem; color:var(--text-muted); margin-top:1px; }
        .list-item { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:background var(--transition); }
        .list-item:last-child { border-bottom:none; }
        .list-item:hover { opacity:0.85; }
      `}</style>
    </div>
  )
}
