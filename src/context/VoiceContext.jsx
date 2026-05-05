import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecognition, parseVoiceCommand, speak, stopSpeaking } from '../lib/voice'
import { useApp } from './AppContext'

const VoiceContext = createContext(null)
export const useVoice = () => useContext(VoiceContext)

export function VoiceProvider({ children }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition))
  const recognitionRef = useRef(null)
  const navigate = useNavigate()
  const { toast, askAI } = useApp()

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (listening) { stopListening(); return }
    setTranscript('')
    const rec = createRecognition({
      onResult: (text, isFinal) => {
        setTranscript(text)
        if (isFinal) {
          handleCommand(text)
          recognitionRef.current = null
          setListening(false)
        }
      },
      onEnd: () => { setListening(false); recognitionRef.current = null },
      onError: (err) => { toast(`Voice error: ${err}`, 'error'); setListening(false) },
    })
    if (!rec) { toast('Voice not supported in this browser', 'warning'); return }
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [listening])

  const handleCommand = useCallback((text) => {
    const cmd = parseVoiceCommand(text)
    switch (cmd.action) {
      case 'navigate':
        navigate(cmd.target)
        speak(`Opening ${cmd.target.replace('/', '').replace('-', ' ') || 'dashboard'}`)
        toast(`🎙️ Going to ${cmd.target}`, 'info')
        break
      case 'generate-lesson':
        navigate('/lessons', { state: { prefill: { topic: cmd.topic, grade: cmd.grade } } })
        speak(`Opening lesson generator for ${cmd.topic}`)
        toast(`🎙️ Lesson generator ready for: ${cmd.topic}`, 'info')
        break
      case 'generate-question-paper':
        navigate('/question-paper', { state: { prefill: { subject: cmd.subject, grade: cmd.grade } } })
        speak('Opening question paper builder')
        toast(`🎙️ Question paper: ${cmd.subject}`, 'info')
        break
      case 'read':
        const content = document.querySelector('.page-wrapper')?.innerText || ''
        speak(content.slice(0, 500))
        break
      case 'stop':
        stopSpeaking()
        toast('🔇 Stopped reading', 'info')
        break
      case 'add-task':
        navigate('/todo', { state: { prefill: { title: cmd.task } } })
        toast(`✅ Adding task: ${cmd.task}`, 'success')
        break
      case 'ai-reflect':
        askAI(`/reflect ${cmd.content}`)
        speak(`Starting portfolio reflection ${cmd.content ? 'on your day' : ''}`)
        break
      case 'ai-check':
        askAI(`/check ${cmd.content}`)
        speak('Checking text for Harvard style and tone')
        break
      case 'ai-idea':
        askAI(`/idea ${cmd.content}`)
        speak(`Generating classroom activities for ${cmd.content}`)
        break
      case 'ai-chat':
        askAI(cmd.content)
        break
      default:
        toast(`🎙️ Heard: "${text}" — Command not recognized`, 'warning')
    }
  }, [navigate])

  return (
    <VoiceContext.Provider value={{ listening, transcript, supported, startListening, stopListening, setTranscript }}>
      {children}
    </VoiceContext.Provider>
  )
}
