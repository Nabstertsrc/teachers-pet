import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('tp_theme') || 'office')
  const [toasts, setToasts] = useState([])
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm your Unified Teaching Assistant. Use these commands to get started:\n\n/reflect - Portfolio reflections\n/check - Harvard citation check\n/idea - Classroom activities\n\nOr just ask me anything!" }
  ])
  const [aiLoading, setAiLoading] = useState(false)
  const toastId = useRef(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tp_theme', theme)
  }, [theme])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const dismissToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const askAI = useCallback(async (text) => {
    setAiPanelOpen(true)
    setAiMessages(prev => [...prev, { role: 'user', content: text }])
    // Logic for calling the actual AI will stay in AIAssistant or move here.
    // For now, let's just trigger the state change.
  }, [])

  return (
    <AppContext.Provider value={{ 
      sidebarCollapsed, setSidebarCollapsed, 
      mobileMenuOpen, setMobileMenuOpen,
      aiPanelOpen, setAiPanelOpen, 
      aiMessages, setAiMessages,
      aiLoading, setAiLoading,
      askAI,
      toast, theme, setTheme 
    }}>
      <ToastContext.Provider value={toast}>
        {children}
        <ToastContainer toasts={toasts} dismiss={dismissToast} />
      </ToastContext.Provider>
    </AppContext.Provider>
  )
}

function ToastContainer({ toasts, dismiss }) {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' }
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)} style={{ cursor: 'pointer' }}>
          <span>{icons[t.type] || 'ℹ️'}</span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
