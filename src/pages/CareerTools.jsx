import { useState } from 'react'
import { useToast } from '../context/AppContext'
import { generateResume, generateCoverLetter } from '../lib/gemini'
import { exportToPDF, exportToDocx } from '../lib/export'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CareerTools() {
  const toast = useToast()
  const [tab, setTab] = useState('resume')
  const [generating, setGenerating] = useState(false)
  const [scanContent, setScanContent] = useState('')
  const [result, setResult] = useState('')
  const [mode, setMode] = useState('resume') // resume, cover, bio
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    education: '',
    experience: '',
    skills: '',
    targetRole: '',
    targetCompany: '',
    additionalInfo: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleScan = async () => {
    if (!scanContent.trim()) {
      toast('Please paste some content to scan', 'warning')
      return
    }
    setGenerating(true)
    try {
      const extracted = await generateResume({ scanContent, mode: 'extract' })
      
      try {
        const data = JSON.parse(extracted)
        setForm(f => ({ ...f, ...data }))
        toast('Information extracted successfully! Check the fields.', 'success')
        setTab('resume')
      } catch (e) {
        // If not JSON, maybe it just gave a summary
        set('additionalInfo', extracted)
        toast('Scanned and summarized info.', 'info')
      }
    } catch {
      toast('Scan failed. Please try manual entry.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateResume = async () => {
    if (!form.name || !form.experience) {
      toast('Name and Experience are required', 'warning')
      return
    }
    setGenerating(true)
    try {
      const res = await generateResume(form)
      setResult(res)
      toast('Resume generated!', 'success')
    } catch {
      toast('Generation failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!form.name || !form.targetRole) {
      toast('Name and Target Role are required', 'warning')
      return
    }
    setGenerating(true)
    try {
      const res = await generateCoverLetter(form)
      setResult(res)
      toast('Cover Letter generated!', 'success')
    } catch {
      toast('Generation failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateBio = async () => {
    if (!form.name || !form.experience) {
      toast('Name and Experience are required', 'warning')
      return
    }
    setGenerating(true)
    try {
      const res = await generateResume({ ...form, mode: 'bio' })
      setResult(res)
      toast('Bio & LinkedIn Profile Generated!', 'success')
    } catch {
      toast('Generation failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🚀 Professional Career Tools</h1>
          <p className="page-subtitle">AI-powered resume builder, cover letter generator, and document scanner</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>🔍 Scan Doc / Paste CV</button>
        <button className={`tab ${tab === 'resume' ? 'active' : ''}`} onClick={() => {setTab('resume'); setMode('resume')}}>📄 Resume Builder</button>
        <button className={`tab ${tab === 'cover' ? 'active' : ''}`} onClick={() => {setTab('cover'); setMode('cover')}}>✉️ Cover Letter</button>
        <button className={`tab ${tab === 'bio' ? 'active' : ''}`} onClick={() => {setTab('bio'); setMode('bio')}}>🌟 Bio & LinkedIn</button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="space-y-4">
          {tab === 'scan' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>🔍 Scan Existing Document</h3>
                <label className="btn btn-sm btn-ghost" style={{ cursor: 'pointer' }}>
                  📁 Upload File
                  <input type="file" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const text = await file.text()
                      setScanContent(text)
                      toast('File loaded! Click Scan to extract.', 'info')
                    }
                  }} />
                </label>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Paste your current CV, a list of achievements, or any professional text here. Our AI will extract the key details to pre-fill your new resume.
              </p>
              <textarea 
                className="form-textarea" 
                rows={12} 
                placeholder="Paste CV content here..." 
                value={scanContent}
                onChange={e => setScanContent(e.target.value)}
              />
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={handleScan} disabled={generating}>
                {generating ? 'Scanning & Extracting...' : '⚡ Scan and Extract Details'}
              </button>
            </div>
          )}

          {(tab === 'resume' || tab === 'cover' || tab === 'bio') && (
            <div className="card">
              <h3>
                {tab === 'resume' ? '📄 Resume Details' : 
                 tab === 'cover' ? '✉️ Cover Letter Details' : 
                 '🌟 Bio & LinkedIn Details'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">LinkedIn (URL)</label><input className="form-input" value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} /></div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Target Role / Job Title</label>
                  <input className="form-input" placeholder="e.g. Senior Educator, Department Head" value={form.targetRole} onChange={e => set('targetRole', e.target.value)} />
                </div>

                {tab === 'cover' && (
                  <div className="form-group">
                    <label className="form-label">Target Company / School</label>
                    <input className="form-input" placeholder="e.g. Prestige High School" value={form.targetCompany} onChange={e => set('targetCompany', e.target.value)} />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Key Experience</label>
                  <textarea className="form-textarea" rows={4} placeholder="Summarize your work history..." value={form.experience} onChange={e => set('experience', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Education & Certifications</label>
                  <textarea className="form-textarea" rows={3} placeholder="Degrees, SACE registration, etc." value={form.education} onChange={e => set('education', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Skills</label>
                  <input className="form-input" placeholder="e.g. Curriculum Planning, Classroom Management, AI Literacy" value={form.skills} onChange={e => set('skills', e.target.value)} />
                </div>

                <button className="btn btn-primary btn-lg" onClick={
                  tab === 'resume' ? handleGenerateResume : 
                  tab === 'cover' ? handleGenerateCoverLetter : 
                  handleGenerateBio
                } disabled={generating}>
                  {generating ? '✨ Generating...' : 
                   (tab === 'resume' ? '⚡ Generate Resume' : 
                    tab === 'cover' ? '⚡ Generate Cover Letter' : 
                    '⚡ Optimize LinkedIn & Bio')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {!result && !generating && (
            <div className="card" style={{ textAlign: 'center', padding: 40, border: '2px dashed var(--border-light)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
              <h3>Ready to Build?</h3>
              <p style={{ color: 'var(--text-muted)' }}>Fill in the details or scan an existing doc to generate your professional documents.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <h3>AI is crafting your {tab === 'resume' ? 'Resume' : 'Cover Letter'}...</h3>
              <p style={{ color: 'var(--text-muted)' }}>This takes about 10-15 seconds.</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Preview</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-light" onClick={() => exportToDocx({ title: tab === 'resume' ? 'Resume' : 'Cover Letter', content: result, filename: `${form.name}_${tab}` })}>Word</button>
                  <button className="btn btn-sm btn-light" onClick={() => exportToPDF('career-preview', `${form.name}_${tab}`)}>PDF</button>
                </div>
              </div>
              <div id="career-preview" style={{ padding: 40, background: 'white', color: 'black' }}>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
