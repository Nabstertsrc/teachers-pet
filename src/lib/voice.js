// ===== Voice Recognition & Synthesis =====

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export function createRecognition({ onResult, onEnd, onError, continuous = false, lang = 'en-ZA' }) {
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported')
    return null
  }
  const recognition = new SpeechRecognition()
  recognition.continuous = continuous
  recognition.interimResults = true
  recognition.lang = lang
  recognition.maxAlternatives = 1

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
    const isFinal = e.results[e.results.length - 1].isFinal
    onResult?.(transcript, isFinal)
  }
  recognition.onend = () => onEnd?.()
  recognition.onerror = (e) => onError?.(e.error)
  return recognition
}

export function speak(text, { rate = 1, pitch = 1, lang = 'en-ZA' } = {}) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.rate = rate; utt.pitch = pitch; utt.lang = lang
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
    || voices.find(v => v.lang.startsWith('en'))
  if (preferred) utt.voice = preferred
  window.speechSynthesis.speak(utt)
}

export function stopSpeaking() { window.speechSynthesis?.cancel() }

export function parseVoiceCommand(transcript) {
  const t = transcript.toLowerCase().trim()
  
  // Navigation commands
  if (t.includes('go to dashboard') || t.includes('open dashboard')) return { action: 'navigate', target: '/' }
  if (t.includes('go to lessons') || t.includes('open lessons')) return { action: 'navigate', target: '/lessons' }
  if (t.includes('open timetable') || t.includes('go to timetable')) return { action: 'navigate', target: '/timetable' }
  if (t.includes('open gradebook') || t.includes('go to gradebook')) return { action: 'navigate', target: '/gradebook' }
  if (t.includes('open settings') || t.includes('go to settings')) return { action: 'navigate', target: '/settings' }
  if (t.includes('open question paper') || t.includes('go to question paper')) return { action: 'navigate', target: '/question-paper' }
  if (t.includes('open annual plan') || t.includes('go to annual plan')) return { action: 'navigate', target: '/annual-plan' }
  if (t.includes('open resources') || t.includes('go to resources')) return { action: 'navigate', target: '/resources' }
  if (t.includes('open todo') || t.includes('go to todo') || t.includes('open tasks')) return { action: 'navigate', target: '/todo' }
  if (t.includes('open student') || t.includes('student portal')) return { action: 'navigate', target: '/student' }

  // Generate commands
  const lessonMatch = t.match(/generate (?:a )?lesson (?:on |about )?(.+?)(?:\s+for grade\s+(\w+))?$/i)
  if (lessonMatch) return { action: 'generate-lesson', topic: lessonMatch[1], grade: lessonMatch[2] || '' }
  
  const qpMatch = t.match(/(?:create|generate) (?:a )?question paper (?:for )?(.+?)(?:\s+grade\s+(\w+))?$/i)
  if (qpMatch) return { action: 'generate-question-paper', subject: qpMatch[1], grade: qpMatch[2] || '' }

  // Read command
  if (t.includes('read this') || t.includes('read to me')) return { action: 'read' }

  // Stop command
  if (t.includes('stop') || t.includes('cancel') || t.includes('quiet')) return { action: 'stop' }

  // Add task
  const taskMatch = t.match(/add (?:a )?task[:\s]+(.+)/i)
  if (taskMatch) return { action: 'add-task', task: taskMatch[1] }

  // Unified Teaching Assistant Commands
  if (t.includes('reflect on') || t.includes('start reflection')) return { action: 'ai-reflect', content: t.replace(/reflect on|start reflection/i, '').trim() }
  if (t.includes('check this') || t.includes('harvard check')) return { action: 'ai-check', content: t.replace(/check this|harvard check/i, '').trim() }
  if (t.includes('idea for') || t.includes('classroom ideas')) return { action: 'ai-idea', content: t.replace(/idea for|classroom ideas/i, '').trim() }
  if (t.includes('ask ai') || t.includes('tell ai')) return { action: 'ai-chat', content: t.replace(/ask ai|tell ai/i, '').trim() }

  return { action: 'unknown', transcript: t }
}

export const isSpeechSupported = () => !!SpeechRecognition
