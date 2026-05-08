import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '../lib/storage'
import { useToast, useApp } from '../context/AppContext'

const CURRICULA = ['CAPS (South Africa)','UK National Curriculum','US Common Core','IB (International Baccalaureate)','Cambridge','Generic/Flexible']
const FONT_SIZES = [{ value:'small', label:'Small' },{ value:'medium', label:'Medium (Default)' },{ value:'large', label:'Large' }]
const THEMES = [
  { value:'dark', label:'Dark Mode 🌙', desc:'Easy on the eyes at night' },
  { value:'light', label:'Light Mode ☀️', desc:'Clean and bright' },
]

export default function Settings() {
  const toast = useToast()
  const { theme, setTheme } = useApp()
  const [settings, setSettings] = useState({})
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const load = async () => {
      const s = await getSettings()
      setSettings(s)
    }
    load()
  }, [])

  const set = (k,v) => setSettings(s=>({...s,[k]:v}))

  const handleSave = async () => {
    await saveSettings(settings); setSaved(true)
    toast('Settings saved! ✅', 'success')
    setTimeout(() => setSaved(false), 2000)
    if (settings.fontSize === 'large') document.documentElement.style.fontSize = '18px'
    else if (settings.fontSize === 'small') document.documentElement.style.fontSize = '14px'
    else document.documentElement.style.fontSize = '16px'
  }

  const handleClearData = async () => {
    if (window.confirm('⚠️ This will delete ALL your lessons, plans, gradebook, and settings. This cannot be undone. Continue?')) {
      const { db } = await import('../lib/db')
      await db.delete()
      localStorage.clear(); toast('All data cleared', 'info'); window.location.reload()
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">⚙️ Settings</h1><p className="page-subtitle">Configure your Teacher's Pet experience</p></div>
        <button className={`btn ${saved?'btn-success':'btn-primary'}`} onClick={handleSave}>{saved?'✅ Saved!':'💾 Save Settings'}</button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>

        {/* School Profile */}
        <div className="card">
          <h3 style={{ marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>🏫 School Profile</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group"><label className="form-label">School / Institution Name</label><input className="form-input" placeholder="e.g. Sunshine Primary School" value={settings.schoolName||''} onChange={e=>set('schoolName',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Teacher's Name</label><input className="form-input" placeholder="Your name (shown on dashboard)" value={settings.teacherName||''} onChange={e=>set('teacherName',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Curriculum Framework</label><select className="form-select" value={settings.curriculum||'CAPS (South Africa)'} onChange={e=>set('curriculum',e.target.value)}>{CURRICULA.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
        </div>

        {/* AI API Keys */}
        <div className="card">
          <h3 style={{ marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>🤖 AI Configuration</h3>
          <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:16 }}>These keys power lesson generation, annual plans, question papers, and the AI assistant.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Google Gemini API Key</label>
              <div style={{ position:'relative' }}>
                <input className="form-input" type={showKey?'text':'password'} placeholder="AIza…" value={settings.geminiKey||''} onChange={e=>set('geminiKey',e.target.value)} style={{ paddingRight:80 }} />
                <button onClick={()=>setShowKey(s=>!s)} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.82rem' }}>{showKey?'🙈 Hide':'👁️ Show'}</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">DeepSeek API Key (Alternative)</label>
              <input className="form-input" type="password" placeholder="sk-…" value={settings.deepseekKey||''} onChange={e=>set('deepseekKey',e.target.value)} />
            </div>
            <div style={{ padding:'12px 14px', background:'rgba(108,99,255,0.08)', borderRadius:'var(--radius)', border:'1px solid rgba(108,99,255,0.2)' }}>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>🔒 Keys are stored only in your browser's localStorage and never sent to any server other than the AI providers.</p>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="card">
          <h3 style={{ marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>🎙️ Voice Assistant</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <label style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
              <input type="checkbox" checked={settings.voiceEnabled!==false} onChange={e=>set('voiceEnabled',e.target.checked)} style={{ width:18,height:18,accentColor:'var(--primary)' }} />
              <div><div style={{ fontWeight:600, fontSize:'0.9rem' }}>Enable Voice Commands</div><div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Use the mic button or keyboard shortcut to issue commands</div></div>
            </label>
            <div className="form-group"><label className="form-label">Voice Language</label>
              <select className="form-select" value={settings.voiceLang||'en-ZA'} onChange={e=>set('voiceLang',e.target.value)}>
                {[['en-ZA','English (South Africa)'],['en-GB','English (UK)'],['en-US','English (US)'],['af-ZA','Afrikaans'],['fr-FR','French'],['es-ES','Spanish']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="card">
          <h3 style={{ marginBottom:16 }}>🎨 Themes & Appearance</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Active Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {[
                  { id: 'office', label: 'Office Blue', color: '#0078D4', bg: '#F3F2F1' },
                  { id: 'dark', label: 'Classic Dark', color: '#6C63FF', bg: '#0F0F1A' },
                  { id: 'midnight', label: 'Midnight', color: '#00D9C4', bg: '#050505' }
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setTheme(t.id)} 
                    className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                    style={{ '--theme-color': t.color, '--theme-bg': t.bg }}
                  >
                    <div className="theme-preview" />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Font Size</label>
              <div style={{ display:'flex', gap:10 }}>
                {FONT_SIZES.map(f=>(
                  <button key={f.value} onClick={()=>set('fontSize',f.value)} className={`btn ${settings.fontSize===f.value?'btn-primary':'btn-ghost'} btn-sm`}>{f.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .theme-btn {
            display: flex; flex-direction: column; align-items: center; gap: 8px;
            padding: 12px; border-radius: var(--radius); border: 2px solid var(--border);
            background: var(--bg-surface); cursor: pointer; transition: all var(--transition);
          }
          .theme-btn:hover { border-color: var(--theme-color); transform: translateY(-2px); }
          .theme-btn.active { border-color: var(--theme-color); background: var(--bg-hover); box-shadow: var(--shadow); }
          .theme-preview { width: 100%; height: 40px; border-radius: 4px; background: var(--theme-bg); border: 1px solid var(--border); position: relative; overflow: hidden; }
          .theme-preview::after { content: ''; position: absolute; top: 10px; left: 10px; width: 60%; height: 4px; background: var(--theme-color); border-radius: 2px; }
          .theme-btn span { font-size: 0.8rem; font-weight: 600; color: var(--text); }
        `}</style>

        {/* Privacy & Security Center */}
        <div className="card">
          <h3 style={{ marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>🛡️ Privacy & Security Center</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background:'var(--bg-surface)', borderRadius:'var(--radius)' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.9rem' }}>Environment Secrets</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Status of keys in your .env file</div>
              </div>
              <div className="badge badge-success" style={{ fontSize:'0.7rem' }}>
                {import.meta.env.VITE_GEMINI_API_KEY ? '✅ .env Loaded' : '⚠️ Using Local Only'}
              </div>
            </div>
            
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background:'var(--bg-surface)', borderRadius:'var(--radius)' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.9rem' }}>Data Residence</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Where your information is stored</div>
              </div>
              <div className="badge badge-secondary" style={{ fontSize:'0.7rem' }}>📍 Device Local</div>
            </div>

            <div className="alert-info" style={{ padding: 12, borderRadius: 8, background: 'rgba(0, 120, 212, 0.05)', border: '1px solid rgba(0, 120, 212, 0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                🔒 <strong>Privacy First:</strong> This application is "Offline-First". Your lesson plans, student names, and grades are stored <strong>only</strong> in your browser's local database (IndexedDB) and are never synced to a cloud server.
              </p>
            </div>
            
            <button className="btn btn-ghost btn-sm" onClick={() => {
              if (window.confirm('Wipe only the API keys from local storage? System defaults will be used.')) {
                set('geminiKey', ''); set('deepseekKey', '');
                toast('API keys cleared from local storage', 'info')
              }
            }}>🧹 Wipe Local API Keys</button>
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="card">
          <h3 style={{ marginBottom:16 }}>📋 Available Voice Commands</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              '"Go to dashboard"', '"Open lessons"', '"Open timetable"', '"Open gradebook"',
              '"Generate a lesson on [topic] for [grade]"', '"Create a question paper for [subject]"',
              '"Add a task: [task name]"', '"Read this to me"',
              '"Open settings"', '"Open student portal"',
            ].map((cmd,i)=>(
              <div key={i} style={{ padding:'8px 12px', background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', fontSize:'0.8rem', color:'var(--primary-light)', fontStyle:'italic' }}>{cmd}</div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ borderColor:'rgba(255,107,107,0.3)' }}>
          <h3 style={{ marginBottom:8, color:'var(--accent)' }}>⚠️ Danger Zone</h3>
          <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:14 }}>Permanently delete all local data including lessons, plans, gradebook, and settings.</p>
          <button className="btn btn-danger" onClick={handleClearData}>🗑️ Clear All Data</button>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button className={`btn btn-lg ${saved?'btn-success':'btn-primary'}`} onClick={handleSave} style={{ minWidth:180 }}>{saved?'✅ Settings Saved!':'💾 Save All Settings'}</button>
        </div>
      </div>
    </div>
  )
}
