import { useVoice } from '../context/VoiceContext'

export default function VoiceBar({ collapsed }) {
  const { listening, transcript, supported, startListening } = useVoice()

  if (!supported) return null

  return (
    <div className={`voice-bar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <button
        className={`voice-btn ${listening ? 'listening' : ''}`}
        onClick={startListening}
        title={listening ? 'Stop listening (click to cancel)' : 'Start voice command'}
      >
        {listening ? '🛑' : '🎙️'}
      </button>

      <div className="voice-transcript">
        {listening ? (
          <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="generating-dots"><span/><span/><span/></span>
            {transcript || 'Listening…'}
          </span>
        ) : (
          <span>{transcript ? `"${transcript}"` : 'Say a command — e.g. "Generate a lesson on photosynthesis for Grade 9"'}</span>
        )}
      </div>

      <div className="hide-mobile" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <div className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
          🎙️ Voice Active
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          Try: "Open timetable" · "Create question paper"
        </div>
      </div>
    </div>
  )
}
