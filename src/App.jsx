import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { VoiceProvider } from './context/VoiceContext'
import Sidebar from './components/Sidebar'
import VoiceBar from './components/VoiceBar'
import AIAssistant from './components/AIAssistant'
import Dashboard from './pages/Dashboard'
import LessonGenerator from './pages/LessonGenerator'
import AnnualPlan from './pages/AnnualPlan'
import QuestionPaper from './pages/QuestionPaper'
import Timetable from './pages/Timetable'
import Gradebook from './pages/Gradebook'
import Resources from './pages/Resources'
import StudentPortal from './pages/StudentPortal'
import Todo from './pages/Todo'
import ParentComm from './pages/ParentComm'
import Attendance from './pages/Attendance'
import RubricGenerator from './pages/RubricGenerator'
import ReportCard from './pages/ReportCard'
import Settings from './pages/Settings'
import Professionalism from './pages/Professionalism'
import CareerTools from './pages/CareerTools'
import StudentDashboard from './pages/student/StudentDashboard'
import IPTPortfolio from './pages/IPTPortfolio'
import AcademicCoach from './pages/AcademicCoach'
import ClassroomIdeas from './pages/ClassroomIdeas'
import Assignments from './pages/student/Assignments'
import LearningPath from './pages/student/LearningPath'
import AutoOrganizer from './pages/student/AutoOrganizer'
import Achievements from './pages/student/Achievements'
import OpportunitiesHub from './pages/student/OpportunitiesHub'
import Institutions from './pages/student/Institutions'
import GamePlayer from './pages/student/GamePlayer'

function AppShell() {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useApp()
  const { pathname } = useLocation()

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, setMobileMenuOpen])

  return (
    <div className={`app-shell ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setMobileMenuOpen(true)}>
          <span className="menu-icon">☰</span>
        </button>
        <div className="mobile-logo">🍎 Teacher's Pet</div>
        <div style={{ width: 40 }} /> {/* Spacer */}
      </header>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />}

      <Sidebar />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonGenerator />} />
          <Route path="/annual-plan" element={<AnnualPlan />} />
          <Route path="/question-paper" element={<QuestionPaper />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/gradebook" element={<Gradebook />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/rubric" element={<RubricGenerator />} />
          <Route path="/report-card" element={<ReportCard />} />
          <Route path="/professionalism" element={<Professionalism />} />
          <Route path="/career-tools" element={<CareerTools />} />
          <Route path="/ipt-portfolio" element={<IPTPortfolio />} />
          <Route path="/academic-coach" element={<AcademicCoach />} />
          <Route path="/classroom-ideas" element={<ClassroomIdeas />} />
          
          {/* Student Section */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/auto-organizer" element={<AutoOrganizer />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/opportunities" element={<OpportunitiesHub />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/game/:gameId" element={<GamePlayer />} />
          
          {/* Tools */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/parent-comm" element={<ParentComm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <AIAssistant />
      <VoiceBar collapsed={sidebarCollapsed} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/teachers-pet" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <VoiceProvider>
          <AppShell />
        </VoiceProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
