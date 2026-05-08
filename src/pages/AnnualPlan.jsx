import { useState, useEffect } from 'react'
import { generateAnnualPlan } from '../lib/gemini'
import { saveAnnualPlan, getAnnualPlans, deleteAnnualPlan, getSettings, getSchoolProfile } from '../lib/storage'
import { exportToDocx } from '../lib/export'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SA_LANGUAGES = ['isiZulu','isiXhosa','Afrikaans','English','Sepedi','Sesotho','Setswana','Xitsonga','Tshivenda','siSwati','isiNdebele']
const SUBJECTS = [
  ...SA_LANGUAGES.map(l => `${l} Home Language`),
  ...SA_LANGUAGES.map(l => `${l} First Additional Language`),
  'Mathematics','Natural Sciences','Life Skills','Economic Management Sciences','Social Sciences','Technology','Creative Arts','Life Orientation','Physical Sciences','Life Sciences','Accounting','Business Studies','History','Geography','Other'
]
const GRADES = ['Grade R','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']
const PHASES = [
  { name: 'Foundation Phase (R-3)', url: 'https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/2023ATPsFP.aspx' },
  { name: 'Intermediate Phase (4-6)', url: 'https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/2023ATPsIP.aspx' },
  { name: 'Senior Phase (7-9)', url: 'https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/2023ATPsSP.aspx' },
  { name: 'FET Phase (10-12)', url: 'https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/2023ATPsFET.aspx' },
]

const CURATED_ATPS = {
  'Foundation Phase (R-3)': [
    { name: 'Grade R English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=k3oT4XwS-1Q%3d&tabid=3206&portalid=0&mid=10820' },
    { name: 'Grade R Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=mFm4uD7L0Xk%3d&tabid=3206&portalid=0&mid=10820' },
    { name: 'Grade 1 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=2XJInZlDscs%3d&tabid=3206&portalid=0&mid=10821' },
    { name: 'Grade 1 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=UqH_NfB9e9I%3d&tabid=3206&portalid=0&mid=10821' },
    { name: 'Grade 2 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=zK7E-y-n-ls%3d&tabid=3206&portalid=0&mid=10821' },
    { name: 'Grade 2 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=7Gk1_8mQZko%3d&tabid=3206&portalid=0&mid=10821' },
    { name: 'Grade 3 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=Xo9Nf1L0694%3d&tabid=3206&portalid=0&mid=10822' },
    { name: 'Grade 3 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=f0_Nf1Z0SIs%3d&tabid=3206&portalid=0&mid=10822' },
  ],
  'Intermediate Phase (4-6)': [
    { name: 'Grade 4 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=6zk_EXwRrWc%3d&tabid=3207&portalid=0&mid=10740' },
    { name: 'Grade 4 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=HINtK497f94%3d&tabid=3207&portalid=0&mid=10739' },
    { name: 'Grade 5 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=JdSLzu0_XdI%3d&tabid=3207&portalid=0&mid=10741' },
    { name: 'Grade 5 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=Zcwzy598npw%3d&tabid=3207&portalid=0&mid=10742' },
    { name: 'Grade 6 English HL', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=eiajjtP5IZQ%3d&tabid=3207&portalid=0&mid=10743' },
    { name: 'Grade 6 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=cT8nlsKsBAs%3d&tabid=3207&portalid=0&mid=10744' },
  ],
  'Senior Phase (7-9)': [
    { name: 'Grade 7 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=ntUvRUteBtQ%3d&tabid=3208&portalid=0&mid=10747' },
    { name: 'Grade 8 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=E68Ig0s3y4U%3d&tabid=3208&portalid=0&mid=10749' },
    { name: 'Grade 9 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=UVUDK7_VooM%3d&tabid=3208&portalid=0&mid=10751' },
  ],
  'FET Phase (10-12)': [
    { name: 'Grade 10 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=ZX3jJwqKE2E%3d&tabid=3205&portalid=0&mid=10736' },
    { name: 'Grade 11 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=d9piy_Yst2E%3d&tabid=3205&portalid=0&mid=10752' },
    { name: 'Grade 12 Mathematics', url: 'https://www.education.gov.za/LinkClick.aspx?fileticket=_kS5tgxXQ0I%3d&tabid=3205&portalid=0&mid=10755' },
  ]
}

export default function AnnualPlan() {
  const toast = useToast()
  const [plans, setPlans] = useState([])
  const [settings, setSettings] = useState({})
  const [school, setSchool] = useState(null)
  const [form, setForm] = useState({ subject: '', grade: '', terms: '4', weeksPerTerm: '10', curriculum: 'CAPS (South Africa)' })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [tab, setTab] = useState('generate')

  useEffect(() => {
    const load = async () => {
      const [s, p, sch] = await Promise.all([getSettings(), getAnnualPlans(), getSchoolProfile()])
      setSettings(s)
      setPlans(p)
      setSchool(sch)
    }
    load()
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = async () => {
    if (!form.subject || !form.grade) { toast('Please select Subject and Grade', 'warning'); return }
    setGenerating(true); setResult('')
    try {
      const text = await generateAnnualPlan(form)
      setResult(text); setTab('preview')
    } catch { toast('AI generation failed. Check your API key.', 'error') }
    finally { setGenerating(false) }
  }

  const handleSave = async () => {
    await saveAnnualPlan({ subject: form.subject, grade: form.grade, content: result, terms: form.terms, curriculum: form.curriculum })
    const updated = await getAnnualPlans()
    setPlans(updated); toast('Annual plan saved!', 'success')
  }

  const handleExport = () => {
    exportToDocx({ title: `Annual Teaching Plan — ${form.subject} ${form.grade}`, content: result, filename: `Annual_Plan_${form.subject}_${form.grade}`.replace(/\s/g,'_'), school, subject: form.subject, grade: form.grade })
    toast('Exported to Word!', 'success')
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Annual Teaching Plans (ATP)</h1>
          <p className="page-subtitle">Access official DBE documents or draft custom plans with AI</p>
        </div>
      </div>

      <div className="tabs">
        {['generate','preview','saved'].map(t => <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t==='generate'?'⚡ Generate/Fetch':t==='preview'?'👁️ Preview':'📂 Saved Plans'}</button>)}
      </div>

      {tab === 'generate' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            {/* Official DBE Links */}
            <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>🏫 Official South African DBE ATPs</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                The Department of Basic Education publishes the official, actual ATPs for all subjects and languages. 
                Use these links to download the official PDF documents for your phase.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PHASES.map(phase => (
                  <a key={phase.name} href={phase.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                    <span>{phase.name}</span>
                    <span style={{ fontSize: '0.8rem' }}>🔗 Open Portal</span>
                  </a>
                ))}
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 10, fontSize: '0.9rem' }}>📄 Direct PDF Downloads (Common Subjects)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(CURATED_ATPS).map(([phase, links]) => (
                  <div key={phase}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>{phase}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {links.map(atp => (
                        <a key={atp.name} href={atp.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.82rem', height: 'auto', textAlign: 'left' }}>
                          <span style={{ marginRight: 8 }}>📑</span>
                          <span>{atp.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 20 }}>🤖 Draft Custom Plan with AI</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group"><label className="form-label">Subject *</label><select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">Select subject…</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Grade *</label><select className="form-select" value={form.grade} onChange={e=>set('grade',e.target.value)}><option value="">Select grade…</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Number of Terms</label><select className="form-select" value={form.terms} onChange={e=>set('terms',e.target.value)}>{['2','3','4'].map(n=><option key={n}>{n}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Weeks per Term</label><select className="form-select" value={form.weeksPerTerm} onChange={e=>set('weeksPerTerm',e.target.value)}>{['8','9','10','11','12','13','14'].map(n=><option key={n}>{n}</option>)}</select></div>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width:'100%', marginTop:20 }} onClick={handleGenerate} disabled={generating}>
                {generating ? <><div className="generating-dots"><span/><span/><span/></div> Generating Draft…</> : '⚡ Draft AI Annual Plan'}
              </button>
            </div>
          </div>

          <div className="card" style={{ background:'linear-gradient(135deg,rgba(0,217,196,0.08),rgba(108,99,255,0.05))' }}>
            <h3 style={{ marginBottom: 16 }}>💡 Pro Tip</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              If you can't find the specific PDF on the DBE site, the AI can help draft a plan based on the CAPS curriculum guidelines. 
              You can then export the draft to Word and refine it.
            </p>
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 10 }}>Languages Supported:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SA_LANGUAGES.map(lang => (
                  <span key={lang} className="tag" style={{ fontSize: '0.72rem' }}>{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div>
          {!result && !generating && <div className="empty-state"><div className="empty-state-icon">📅</div><h3>No plan generated</h3><button className="btn btn-primary" onClick={()=>setTab('generate')}>Generate a Plan</button></div>}
          {generating && <div className="loading-overlay"><div className="spinner"/><p className="loading-text">AI is building your annual teaching plan…</p></div>}
          {result && (
            <>
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                <button className="btn btn-success" onClick={handleSave}>💾 Save Plan</button>
                <button className="btn btn-primary" onClick={handleExport}>📄 Export Word</button>
                <button className="btn btn-ghost" onClick={()=>setTab('generate')}>✏️ Edit</button>
              </div>
              <div id="atp-preview" className="card" style={{ maxWidth:1000, padding:40 }}>
                <div style={{ textAlign:'center', borderBottom:'2px solid var(--border-light)', paddingBottom:20, marginBottom:20 }}>
                  {school?.logo && (
                    <div style={{ width: '100%', height: '220px', marginBottom: 20, overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                      <img src={school.logo} alt="School Letterhead" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                    </div>
                  )}
                  <div style={{ padding: '0 20px' }}>
                    <h2 style={{ fontSize:'1.1rem', fontWeight:700, margin:0 }}>{school?.name?.toUpperCase() || settings.schoolName?.toUpperCase()}</h2>
                    {school?.address && <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:'4px 0' }}>{school.address}</p>}
                    {(school?.phone || school?.email) && (
                      <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:0 }}>
                        {school.phone && `Tel: ${school.phone}`} {school.email && ` | ${school.email}`}
                      </p>
                    )}
                  </div>
                </div>
                <h1 style={{ fontSize:'1.4rem', margin:'12px 0', color:'var(--primary)', borderTop:'1px solid var(--border-light)', paddingTop:12 }}>ANNUAL TEACHING PLAN</h1>
                <div style={{ display:'flex', justifyContent:'center', gap:24, fontSize:'0.88rem', color:'var(--text-secondary)', marginTop:8 }}>
                  <span>Subject: {form.subject}</span><span>Grade: {form.grade}</span><span>Curriculum: {form.curriculum}</span>
                </div>
                <div className="markdown-content" style={{ padding: '0 10px' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}><button className="btn btn-primary" onClick={()=>setTab('generate')}>+ New Plan</button></div>
          {plans.length === 0
            ? <div className="empty-state"><div className="empty-state-icon">📅</div><h3>No saved plans</h3></div>
            : <div className="grid-auto">
                {plans.map(p => (
                  <div key={p.id} className="card" style={{ cursor:'pointer' }} onClick={()=>{setResult(p.content);setForm(f=>({...f,...p}));setTab('preview')}}>
                    <span className="badge badge-success">{p.curriculum?.split(' ')[0]}</span>
                    <h3 style={{ margin:'10px 0 4px' }}>{p.subject}</h3>
                    <p style={{ fontSize:'0.85rem' }}>{p.grade} · {p.terms} Terms</p>
                    <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:6 }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop:10 }} onClick={async e=>{e.stopPropagation(); await deleteAnnualPlan(p.id); setPlans(await getAnnualPlans())}}>🗑️ Delete</button>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  )
}
