import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '🏠', exact: true },
  { path: '/lessons', label: 'Lesson Generator', icon: '📚' },
  { path: '/annual-plan', label: 'Annual Plan', icon: '📅' },
  { path: '/question-paper', label: 'Question Papers', icon: '📝' },
  { path: '/timetable', label: 'Timetable', icon: '🗓️' },
  { path: '/gradebook', label: 'Gradebook', icon: '📊' },
  { path: '/attendance', label: 'Attendance', icon: '📝' },
  { path: '/rubric', label: 'Rubrics', icon: '📏' },
  { path: '/report-card', label: 'Report Cards', icon: '📜' },
  { path: '/resources', label: 'Resources', icon: '📖' },
  { path: '/student', label: 'Student Portal', icon: '🎓' },
  { path: '/parent-comm', label: 'Parent Comm', icon: '📧' },
  { path: '/todo', label: 'To-Do & Reminders', icon: '✅' },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, setAiPanelOpen } = useApp()

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🍎</span>
          {!sidebarCollapsed && <span className="logo-text">Teacher's Pet</span>}
        </div>
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(c => !c)} title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => setAiPanelOpen(o => !o)} title="AI Assistant">
          <span className="nav-icon">🤖</span>
          {!sidebarCollapsed && <span className="nav-label">AI Assistant</span>}
        </button>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Settings">
          <span className="nav-icon">⚙️</span>
          {!sidebarCollapsed && <span className="nav-label">Settings</span>}
        </NavLink>
      </div>
    </aside>
  )
}
