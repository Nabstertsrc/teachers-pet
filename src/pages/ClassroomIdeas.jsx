import { useState } from 'react'
import { generateClassroomIdeas } from '../lib/gemini'
import { useToast } from '../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ClassroomIdeas() {
  const toast = useToast()
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    try {
      const res = await generateClassroomIdeas(topic)
      setResult(res)
      toast('5 creative ideas generated!', 'success')
    } catch {
      toast('Failed to generate ideas', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">💡 Classroom Activity Generator</h1>
          <p className="page-subtitle">Instantly generate 5 creative, engaging activities for any topic.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>Spark Creativity</h3>
          <div className="form-group">
            <label className="form-label">Topic / Subject Matter</label>
            <input 
              className="form-input" 
              placeholder="e.g. Photosynthesis, Ancient Egypt, Quadratic Equations..." 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} onClick={handleGenerate} disabled={generating}>
            {generating ? '✨ Imagining...' : '⚡ Generate 5 Activities'}
          </button>
        </div>

        <div>
          {!result && !generating && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(0, 217, 196, 0.05))', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎨</div>
              <h3>Activity Bank</h3>
              <p style={{ color: 'var(--text-muted)' }}>Enter a topic to see creative pedagogical ideas.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>Thinking out of the box...</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: 16 }}>🎯 Creative Activities</h3>
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
