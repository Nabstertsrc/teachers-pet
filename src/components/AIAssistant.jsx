import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { chatWithAI, generateReflection, checkAcademicTone, generateClassroomIdeas } from '../lib/gemini'
import './AIAssistant.css'

export default function AIAssistant() {
  const { 
    aiPanelOpen, setAiPanelOpen, 
    aiMessages, setAiMessages, 
    aiLoading, setAiLoading,
    askAI 
  } = useApp()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])

  // Process new user messages if the last one doesn't have a response and we aren't loading
  useEffect(() => {
    const lastMsg = aiMessages[aiMessages.length - 1]
    if (lastMsg?.role === 'user' && !aiLoading) {
      processMessage(lastMsg.content)
    }
  }, [aiMessages])

  const processMessage = async (text) => {
    setAiLoading(true)
    try {
      let reply
      if (text.startsWith('/reflect')) {
        const content = text.replace('/reflect', '').trim()
        reply = await generateReflection(content)
      } else if (text.startsWith('/check')) {
        const content = text.replace('/check', '').trim()
        if (!content) reply = "Please provide the text you want me to check for academic tone and Harvard referencing. Example: `/check [your text here]`"
        else reply = await checkAcademicTone(content)
      } else if (text.startsWith('/idea')) {
        const content = text.replace('/idea', '').trim()
        if (!content) reply = "Please provide a topic for classroom ideas. Example: `/idea Photosynthesis`"
        else reply = await generateClassroomIdeas(content)
      } else {
        // Exclude the last message (the one we're processing) from history context to avoid duplication
        reply = await chatWithAI(aiMessages)
      }
      setAiMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      console.error(e)
      setAiMessages(prev => [...prev, { role: 'assistant', content: '❌ Error connecting to AI. Check your API key in Settings.' }])
    } finally {
      setAiLoading(false)
    }
  }

  const send = async () => {
    if (!input.trim() || aiLoading) return
    askAI(input.trim())
    setInput('')
  }

  const quickActions = [
    { label: '📝 Portfolio Reflection', cmd: '/reflect ' },
    { label: '🎓 Harvard Check', cmd: '/check ' },
    { label: '💡 Activity Ideas', cmd: '/idea ' },
    { label: '📧 Parent Email', cmd: 'Write a parent communication email about ' },
  ]

  if (!aiPanelOpen) return null

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>AI Assistant</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>● Powered by Gemini</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setAiPanelOpen(false)}>✕</button>
      </div>

      <div className="ai-messages">
        {aiMessages.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            <div className="ai-msg-bubble">
              <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', fontSize: '0.87rem', lineHeight: 1.6 }}>{m.content}</p>
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="ai-msg assistant">
            <div className="ai-msg-bubble">
              <div className="generating-dots"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {aiMessages.length === 1 && (
        <div className="ai-quick-actions">
          {quickActions.map((q, i) => (
            <button key={i} className="quick-action-btn" onClick={() => { setInput(q.cmd); document.querySelector('.ai-input')?.focus() }}>
              {q.label}
            </button>
          ))}
        </div>
      )}

      <div className="ai-input-area">
        <textarea
          className="ai-input"
          placeholder="Ask anything about teaching…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          rows={2}
        />
        <button className="btn btn-primary btn-sm" onClick={send} disabled={aiLoading || !input.trim()}>
          {aiLoading ? '⏳' : '↑ Send'}
        </button>
      </div>
    </div>
  )
}
