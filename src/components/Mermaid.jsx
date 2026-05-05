import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
})

export default function Mermaid({ chart }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && chart) {
      try {
        ref.current.innerHTML = chart
        mermaid.contentLoaded()
      } catch (err) {
        console.error('Mermaid error:', err)
      }
    }
  }, [chart])

  return (
    <div className="mermaid-container" style={{ margin: '20px 0', textAlign: 'center', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <div className="mermaid" ref={ref}>
        {chart}
      </div>
    </div>
  )
}
