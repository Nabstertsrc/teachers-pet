import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Sidebar.css'

const TEACHER_NAV = [
  { path: '/lessons', label: 'Lesson Generator', icon: '📚' },
  { path: '/annual-plan', label: 'Annual Plan', icon: '📅' },
  { path: '/question-paper', label: 'Question Papers', icon: '📝' },
  { path: '/timetable', label: 'Timetable', icon: '🗓️' },
  { path: '/gradebook', label: 'Gradebook', icon: '📊' },
  { path: '/attendance', label: 'Attendance', icon: '📝' },
  { path: '/rubric', label: 'Rubrics', icon: '📏' },
  { path: '/report-card', label: 'Report Cards', icon: '📜' },
  { path: '/professionalism', label: 'QMS & Intervention', icon: '🛡️' },
  { path: '/career-tools', label: 'Career Tools', icon: '🚀' },
  { path: '/opportunities', label: 'Career Hub', icon: '🌍' },
]

const STUDENT_NAV = [
  { path: '/student', label: 'Student Dashboard', icon: '🎓' },
  { path: '/study-lab', label: 'AI Study Lab', icon: '🔬' },
  { path: '/auto-organizer', label: 'Auto-Organizer', icon: '📂' },
  { path: '/assignments', label: 'Assignments', icon: '📋' },
  { path: '/learning-path', label: 'Learning Path', icon: '🗺️' },
  { path: '/achievements', label: 'Achievements', icon: '🏆' },
  { path: '/opportunities', label: 'Opportunities', icon: '🌍' },
  { path: '/institutions', label: 'Universities', icon: '🏛️' },
]

const SHARED_NAV = [
  { path: '/resources', label: 'Resources', icon: '📖' },
  { path: '/todo', label: 'To-Do List', icon: '✅' },
  { path: '/parent-comm', label: 'Parent Comm', icon: '📧' },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, setAiPanelOpen, mobileMenuOpen } = useApp()

  const renderNavSection = (items, title) => (
    <div className="nav-section">
      {!sidebarCollapsed && <div className="nav-section-title">{title}</div>}
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          title={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
        </NavLink>
      ))}
    </div>
  )

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🍎</span>
          {!sidebarCollapsed && <span className="logo-text">Teacher's Pet</span>}
        </div>
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(c => !c)}>
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
          <span className="nav-icon">🏠</span>
          {!sidebarCollapsed && <span className="nav-label">Home</span>}
        </NavLink>

        {renderNavSection(TEACHER_NAV, 'FOR TEACHERS')}
        {renderNavSection(STUDENT_NAV, 'FOR STUDENTS')}
        {renderNavSection(SHARED_NAV, 'TOOLS')}
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
