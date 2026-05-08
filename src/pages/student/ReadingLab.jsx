import { useState } from 'react'
import { generatePhonicsLesson, generateStory } from '../../lib/gemini'
import { useToast } from '../../context/AppContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const READING_MAP = [
  { level: 1, title: 'First Steps', icon: '🌱', color: '#2ecc71' },
  { level: 2, title: 'Word Builder', icon: '🏗️', color: '#3498db' },
  { level: 3, title: 'Story Explorers', icon: '📚', color: '#9b59b6' },
  { level: 4, title: 'Fluent Readers', icon: '🚀', color: '#e67e22' },
]

export default function ReadingLab() {
  const toast = useToast()
  const [activeLevel, setActiveLevel] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState('')
  const [mode, setMode] = useState('phonics')

  const handleGenerate = async (type) => {
    setGenerating(true)
    setMode(type)
    try {
      let res = ''
      if (type === 'phonics') {
        res = await generatePhonicsLesson(activeLevel)
      } else {
        const topics = ['Friendly Dragon', 'Magic Forest', 'Space Adventure', 'Under the Sea']
        const topic = topics[Math.floor(Math.random() * topics.length)]
        res = await generateStory(topic, activeLevel)
      }
      setContent(res)
      toast(`${type === 'phonics' ? 'Lesson' : 'Story'} is ready! 📖`, 'success')
    } catch {
      toast('Failed to load reading material', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">📖 Reading & Phonics Lab</h1>
          <p className="page-subtitle">Learn to read through interactive levels and AI-generated stories.</p>
        </div>
      </div>

      <div className="reading-map" style={{ display: 'flex', gap: 20, marginBottom: 30, overflowX: 'auto', padding: '10px 0' }}>
        {READING_MAP.map(m => (
          <div 
            key={m.level} 
            className={`map-node ${activeLevel === m.level ? 'active' : ''}`}
            onClick={() => setActiveLevel(m.level)}
            style={{ 
              minWidth: 140, 
              padding: 20, 
              textAlign: 'center', 
              background: activeLevel === m.level ? m.color : 'var(--bg-surface)',
              color: activeLevel === m.level ? 'white' : 'var(--text)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              border: `2px solid ${m.color}`,
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontWeight: 700 }}>Level {m.level}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{m.title}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>🎯 Activities for Level {activeLevel}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Choose an activity to practice your reading skills.
          </p>
          <div className="space-y-4">
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => handleGenerate('phonics')} disabled={generating}>
              🔤 Phonics Lesson
            </button>
            <button className="btn btn-secondary btn-lg" style={{ width: '100%' }} onClick={() => handleGenerate('story')} disabled={generating}>
              📚 Read a Story
            </button>
          </div>
        </div>

        <div>
          {!content && !generating && (
            <div className="card" style={{ border: '2px dashed var(--border-light)', textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🥚</div>
              <h3>Ready to Hatch?</h3>
              <p style={{ color: 'var(--text-muted)' }}>Select an activity to start your reading adventure.</p>
            </div>
          )}

          {generating && (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p>Gathering your reading material...</p>
            </div>
          )}

          {content && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: 16 }}>{mode === 'phonics' ? '🔤 Phonics Practice' : '📚 Story Time'}</h3>
              <div className="markdown-content reading-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>🖨️ Print Lesson</button>
                <button className="btn btn-success btn-sm">🏆 Mark as Finished (+50🍎)</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .reading-content { font-size: 1.1rem; line-height: 1.8; }
        .map-node:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .map-node.active { box-shadow: 0 0 15px currentColor; }
      `}</style>
    </div>
  )
}
