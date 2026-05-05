import { useState } from 'react'
import { generateParentEmail } from '../lib/gemini'
import { useToast } from '../context/AppContext'

const EMAIL_TYPES = [
  { value: 'Positive Feedback', label: 'Positive Feedback 🌟', desc: 'Commend a student for good work or behavior' },
  { value: 'Behavioral Issue', label: 'Behavioral Issue ⚠️', desc: 'Inform parents about classroom behavior concerns' },
  { value: 'Academic Concern', label: 'Academic Concern 📉', desc: 'Discuss falling grades or missed assignments' },
  { value: 'Meeting Request', label: 'Meeting Request 📅', desc: 'Request a formal parent-teacher conference' },
  { value: 'General Update', label: 'General Update 📧', desc: 'General progress report or class announcement' },
]

export default function ParentComm() {
  const toast = useToast()
  const [form, setForm] = useState({ studentName: '', type: 'Positive Feedback', subject: '', details: '' })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!form.studentName || !form.subject) {
      toast('Please enter student name and subject', 'warning')
      return
    }
    setGenerating(true)
    try {
      const email = await generateParentEmail(form)
      setResult(email)
    } catch {
      toast('Failed to generate email. Check API key.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    toast('Copied to clipboard! 📋', 'success')
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📧 Parent Communication</h1>
          <p className="page-subtitle">AI-assisted professional emails and reports for parents</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Email Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Student Name *</label>
              <input 
                className="form-input" 
                placeholder="e.g. John Doe" 
                value={form.studentName} 
                onChange={e => setForm({...form, studentName: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Type</label>
              <select 
                className="form-select" 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
              >
                {EMAIL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject / Reason *</label>
              <input 
                className="form-input" 
                placeholder="e.g. Mathematics Progress, Recent Incident" 
                value={form.subject} 
                onChange={e => setForm({...form, subject: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specific Details / Context</label>
              <textarea 
                className="form-textarea" 
                rows={4} 
                placeholder="Mention specific examples, dates, or actions taken..." 
                value={form.details} 
                onChange={e => setForm({...form, details: e.target.value})}
              />
            </div>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleGenerate} 
              disabled={generating}
            >
              {generating ? 'Generating...' : '⚡ Generate Email'}
            </button>
          </div>
        </div>

        <div>
          {generating && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
              <div className="spinner" />
              <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Drafting your email...</p>
            </div>
          )}
          
          {result && !generating && (
            <div className="card animate-slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--primary-light)' }}>Generated Draft</h3>
                <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>📋 Copy Content</button>
              </div>
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: 20, 
                borderRadius: 'var(--radius)', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.9rem',
                lineHeight: 1.6,
                border: '1px solid var(--border)'
              }}>
                {result}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12 }}>
                ℹ️ Tip: You can paste this directly into your email client. Remember to personalize it as needed.
              </p>
            </div>
          )}

          {!result && !generating && (
            <div className="card-glass" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
              <h3>Ready to write?</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Fill in the details on the left and I'll help you craft a professional, compassionate email in seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
