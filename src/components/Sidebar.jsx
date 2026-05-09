import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Sidebar.css'

const NAV_STRUCTURE = [
  {
    title: 'LESSON PREP',
    icon: '📂',
    items: [
      { path: '/lessons', label: 'Lesson Generator', icon: '📚' },
      { path: '/classroom-ideas', label: 'Classroom Ideas', icon: '💡' },
      { path: '/annual-plan', label: 'Annual Teaching Plan', icon: '📅' },
    ]
  },
  {
    title: 'ASSESSMENTS',
    icon: '📂',
    items: [
      { path: '/question-paper', label: 'Question Papers', icon: '📝' },
      { path: '/rubric', label: 'Rubric Builder', icon: '📏' },
    ]
  },
  {
    title: 'ADMINISTRATION',
    icon: '📂',
    items: [
      { path: '/gradebook', label: 'Gradebook', icon: '📊' },
      { path: '/attendance', label: 'Attendance', icon: '📝' },
      { path: '/timetable', label: 'Timetable', icon: '🗓️' },
      { path: '/report-card', label: 'Report Cards', icon: '📜' },
    ]
  },
  {
    title: 'PROFESSIONAL',
    icon: '📂',
    items: [
      { path: '/professionalism', label: 'QMS & Intervention', icon: '🛡️' },
      { path: '/ipt-portfolio', label: 'IPT Portfolio', icon: '📘' },
      { path: '/academic-coach', label: 'Academic Coach', icon: '🎓' },
      { path: '/career-tools', label: 'Career Tools', icon: '🚀' },
      { path: '/opportunities', label: 'Career Hub', icon: '🌍' },
    ]
  },
  {
    title: 'STUDENT HUB',
    icon: '📂',
    items: [
      { path: '/student', label: 'Dashboard', icon: '🏠' },
      { path: '/student-portal', label: 'Student Portal', icon: '🎓' },
      { path: '/study-lab', label: 'AI Study Lab', icon: '🔬' },
      { path: '/auto-organizer', label: 'Auto-Organizer', icon: '📂' },
      { path: '/assignments', label: 'Assignments', icon: '📋' },
      { path: '/learning-path', label: 'Learning Path', icon: '🗺️' },
      { path: '/maths-lab', label: 'Maths Lab', icon: '📐' },
      { path: '/science-lab', label: 'Science Lab', icon: '⚗️' },
      { path: '/reading-lab', label: 'Reading Lab', icon: '📖' },
      { path: '/social-sciences-hub', label: 'Social Sciences', icon: '🌍' },
      { path: '/english-lab', label: 'English Lab', icon: '📝' },
      { path: '/ems-hub', label: 'EMS Hub', icon: '💼' },
      { path: '/life-orientation', label: 'Life Orientation', icon: '🧭' },
      { path: '/technology-lab', label: 'Technology Lab', icon: '🛠️' },
      { path: '/history-lab', label: 'History Lab', icon: '⏳' },
      { path: '/natural-sciences-lab', label: 'Natural Sciences', icon: '🧬' },
      { path: '/achievements', label: 'Achievements', icon: '🏆' },
      { path: '/institutions', label: 'Universities', icon: '🏛️' },
    ]
  },
  {
    title: 'BRAIN GAMES',
    icon: '📂',
    items: [
      { path: '/games', label: 'Game Lab', icon: '🎮' },
      { path: '/game/fluffy-jump', label: 'Fluffy Jump', icon: '☁️' },
      { path: '/game/word-quest', label: 'Word Quest', icon: '📝' },
      { path: '/maths-games', label: 'Maths Brain Games', icon: '🧠' },
      { path: '/game/snake-game', label: 'Snake Game', icon: '🐍' },
      { path: '/game/number-ninja', label: 'Number Ninja', icon: '🥷' },
      { path: '/game/memory-matrix', label: 'Memory Matrix', icon: '🧩' },
    ]
  },
  {
    title: 'TOOLS',
    icon: '📂',
    items: [
      { path: '/resources', label: 'Resources', icon: '📖' },
      { path: '/todo', label: 'To-Do List', icon: '✅' },
      { path: '/parent-comm', label: 'Parent Comm', icon: '📧' },
      { path: '/about', label: 'About Platform', icon: 'ℹ️' },
    ]
  }
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, setAiPanelOpen, mobileMenuOpen } = useApp()
  const [openFolders, setOpenFolders] = useState(['LESSON PREP', 'STUDENT HUB'])

  const toggleFolder = (title) => {
    setOpenFolders(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const renderNavSection = (section) => {
    const isOpen = openFolders.includes(section.title)
    
    return (
      <div key={section.title} className="nav-folder">
        <div 
          className={`nav-folder-header ${isOpen ? 'open' : ''}`} 
          onClick={() => toggleFolder(section.title)}
          title={section.title}
        >
          <span className="nav-icon folder-icon">{isOpen ? '▾' : '▸'}</span>
          {!sidebarCollapsed && <span className="nav-label">{section.title}</span>}
          {!sidebarCollapsed && <span className="folder-arrow">{isOpen ? '▾' : '▸'}</span>}
        </div>
        
        {isOpen && (
          <div className="nav-folder-content">
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item sub-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🍎</span>
          {!sidebarCollapsed && <span className="logo-text">Teacher's Pet <small style={{fontSize:'0.6rem', opacity:0.5}}>v1.1</small></span>}
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

        {NAV_STRUCTURE.map(renderNavSection)}
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
