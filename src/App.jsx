import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { VoiceProvider } from './context/VoiceContext'
import Sidebar from './components/Sidebar'
import VoiceBar from './components/VoiceBar'
import AIAssistant from './components/AIAssistant'
import React, { Suspense } from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const LessonGenerator = React.lazy(() => import('./pages/LessonGenerator'))
const AnnualPlan = React.lazy(() => import('./pages/AnnualPlan'))
const QuestionPaper = React.lazy(() => import('./pages/QuestionPaper'))
const Timetable = React.lazy(() => import('./pages/Timetable'))
const Gradebook = React.lazy(() => import('./pages/Gradebook'))
const Resources = React.lazy(() => import('./pages/Resources'))
const StudentPortal = React.lazy(() => import('./pages/StudentPortal'))
const Todo = React.lazy(() => import('./pages/Todo'))
const ParentComm = React.lazy(() => import('./pages/ParentComm'))
const Attendance = React.lazy(() => import('./pages/Attendance'))
const RubricGenerator = React.lazy(() => import('./pages/RubricGenerator'))
const ReportCard = React.lazy(() => import('./pages/ReportCard'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Professionalism = React.lazy(() => import('./pages/Professionalism'))
const CareerTools = React.lazy(() => import('./pages/CareerTools'))
const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard'))
const IPTPortfolio = React.lazy(() => import('./pages/IPTPortfolio'))
const AcademicCoach = React.lazy(() => import('./pages/AcademicCoach'))
const ClassroomIdeas = React.lazy(() => import('./pages/ClassroomIdeas'))
const Assignments = React.lazy(() => import('./pages/student/Assignments'))
const LearningPath = React.lazy(() => import('./pages/student/LearningPath'))
const AutoOrganizer = React.lazy(() => import('./pages/student/AutoOrganizer'))
const Achievements = React.lazy(() => import('./pages/student/Achievements'))
const OpportunitiesHub = React.lazy(() => import('./pages/student/OpportunitiesHub'))
const Institutions = React.lazy(() => import('./pages/student/Institutions'))
const MathsLab = React.lazy(() => import('./pages/student/MathsLab'))
const ScienceLab = React.lazy(() => import('./pages/student/ScienceLab'))
const ReadingLab = React.lazy(() => import('./pages/student/ReadingLab'))
const MathsGames = React.lazy(() => import('./pages/student/MathsGames'))
const GameHub = React.lazy(() => import('./pages/student/GameHub'))
const StudyLab = React.lazy(() => import('./pages/student/StudyLab'))
const SocialSciencesHub = React.lazy(() => import('./pages/student/SocialSciencesHub'))
const EnglishLab = React.lazy(() => import('./pages/student/EnglishLab'))
const EMSHub = React.lazy(() => import('./pages/student/EMSHub'))
const LifeOrientationHub = React.lazy(() => import('./pages/student/LifeOrientationHub'))
const TechnologyLab = React.lazy(() => import('./pages/student/TechnologyLab'))
const HistoryLab = React.lazy(() => import('./pages/student/HistoryLab'))
const NaturalSciencesLab = React.lazy(() => import('./pages/student/NaturalSciencesLab'))
const GamePlayer = React.lazy(() => import('./pages/student/GamePlayer'))
const About = React.lazy(() => import('./pages/About'))

function formatTitleFromPath(pathname) {
  if (pathname === '/') return "Dashboard"
  const clean = pathname.replace(/^\/+/, '').replace(/\/+/g, ' ').replace(/-/g, ' ')
  return clean
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

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
        <div className="app-topbar">
          <div className="app-topbar-left">
            <div className="app-topbar-kicker">Teacher Platform</div>
            <div className="app-topbar-title">{formatTitleFromPath(pathname)}</div>
          </div>
          <div className="app-topbar-right">
            <span className="badge badge-primary">Professional Suite</span>
            <span className="badge badge-success">Local First</span>
          </div>
        </div>
        <Suspense fallback={<div className="loading-overlay" style={{ height: '100vh' }}><div className="spinner"></div><div className="loading-text">Loading Module...</div></div>}>
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
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/study-lab" element={<StudyLab />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/auto-organizer" element={<AutoOrganizer />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/opportunities" element={<OpportunitiesHub />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/maths-lab" element={<MathsLab />} />
            <Route path="/science-lab" element={<ScienceLab />} />
            <Route path="/reading-lab" element={<ReadingLab />} />
            <Route path="/maths-games" element={<MathsGames />} />
            <Route path="/games" element={<GameHub />} />
            <Route path="/social-sciences-hub" element={<SocialSciencesHub />} />
            <Route path="/english-lab" element={<EnglishLab />} />
            <Route path="/ems-hub" element={<EMSHub />} />
            <Route path="/life-orientation" element={<LifeOrientationHub />} />
            <Route path="/technology-lab" element={<TechnologyLab />} />
            <Route path="/history-lab" element={<HistoryLab />} />
            <Route path="/natural-sciences-lab" element={<NaturalSciencesLab />} />
            <Route path="/game/:gameId" element={<GamePlayer />} />
            
            {/* Tools */}
            <Route path="/resources" element={<Resources />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/parent-comm" element={<ParentComm />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
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
