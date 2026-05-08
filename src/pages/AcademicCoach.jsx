import { useState } from 'react'
import { checkAcademicTone } from '../lib/gemini'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AcademicCoach() {
  const toast = useToast()
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleCheck = async () => {
    if (!content.trim()) return
    setGenerating(true)
    try {
      const res = await checkAcademicTone(content)
      setResult(res)
      toast('Analysis complete!', 'success')
    } catch {
      toast('Check failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🎓 Academic Tone & Citation Coach</h1>
          <p className="page-subtitle">Refine your writing and check UNISA Harvard referencing style.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>Academic Text Analyzer</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Paste your assignment paragraphs or citations below to check for professional tone and correctness.
          </p>
          <textarea 
            className="form-textarea" 
            rows={12} 
            placeholder="I think that the learners are not motivated because of their background (Smith, 2023)..." 
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={handleCheck} disabled={generating}>
            {generating ? '🕵️ Analyzing...' : '⚡ Check Tone & Referencing'}
          </button>
        </div>

        <div>
          {!result && !generating && (
            <div className="card" style={{ border: '2px dashed var(--border-light)', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧐</div>
              <h3>Analysis Results</h3>
              <p style={{ color: 'var(--text-muted)' }}>Suggestions for academic improvement will appear here.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>Analyzing your academic tone...</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: 16 }}>Coach's Feedback</h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
