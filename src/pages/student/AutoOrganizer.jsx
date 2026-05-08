import { useState } from 'react'
import { useToast } from '../../context/AppContext'
import { analyzeDocument } from '../../lib/gemini'
import { extractTextFromPDF } from '../../lib/pdfProcessor'

export default function AutoOrganizer() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setLoading(true)
    
    for (const file of files) {
      try {
        const text = await extractTextFromPDF(file)
        const analysis = await analyzeDocument(text)
        if (analysis) {
          setResults(prev => [{ name: file.name, ...analysis, date: new Date().toLocaleDateString() }, ...prev])
          toast(`Organized ${file.name}! ✨`, 'success')
        }
      } catch {
        toast(`Failed to analyze ${file.name}`, 'error')
      }
    }
    setLoading(false)
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📂 AI Auto-Organizer</h1>
          <p className="page-subtitle">Drop your notes or assignments and let AI sort them into modules</p>
        </div>
      </div>

      <div className="card-glass" style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed var(--border)', marginBottom: 28 }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🧠</div>
        <h2>Drop files here</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Upload PDFs, Images, or Text files to auto-detect subjects and deadlines.</p>
        <label className="btn btn-primary btn-lg" style={{ cursor: 'pointer' }}>
          <input type="file" multiple hidden onChange={handleFiles} accept=".pdf,.txt,.md,.jpg,.png" />
          🚀 Start Organizing
        </label>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 30 }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p>AI is analyzing your files...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <h3>Recently Organized</h3>
          {results.map((res, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: '2rem' }}>{res.isAssignment ? '📅' : '📚'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{res.subject} ({res.moduleCode || 'N/A'})</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.name} • {res.date}</div>
                <div style={{ fontSize: '0.9rem', marginTop: 4 }}>{res.summary}</div>
              </div>
              {res.dueDate && (
                <div className="badge badge-secondary">Due: {res.dueDate}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
