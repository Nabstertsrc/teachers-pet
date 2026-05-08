import { useState } from 'react'
import { generateReflection } from '../lib/gemini'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function IPTPortfolio() {
  const toast = useToast()
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleReflect = async () => {
    setGenerating(true)
    try {
      const res = await generateReflection(content)
      setResult(res)
      toast('Reflection generated!', 'success')
    } catch {
      toast('Failed to generate reflection', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📘 UNISA IPT Portfolio</h1>
          <p className="page-subtitle">Convert your daily teaching experiences into professional reflections.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>Daily Reflection</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Paste your voice transcripts, messy notes, or just describe your day.
          </p>
          <textarea 
            className="form-textarea" 
            rows={10} 
            placeholder="Today I taught grade 10 maths... the kids were a bit noisy but they enjoyed the group activity..." 
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleReflect} disabled={generating}>
              {generating ? '✨ Processing...' : '⚡ Generate Reflection'}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setContent('')}>Clear</button>
          </div>
        </div>

        <div>
          {!result && !generating && (
            <div className="card" style={{ border: '2px dashed var(--border-light)', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🖋️</div>
              <h3>Professional Reflection</h3>
              <p style={{ color: 'var(--text-muted)' }}>Your structured UNISA-compliant reflection will appear here.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>AI is structuring your portfolio entry...</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: 16 }}>Reflective Note</h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 20 }} onClick={() => {
                navigator.clipboard.writeText(result)
                toast('Copied to clipboard!', 'success')
              }}>📋 Copy for Portfolio</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
