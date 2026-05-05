import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function AppShell() {
  const { sidebarCollapsed } = useApp()
  return (
    <div className="app-shell">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonGenerator />} />
          <Route path="/annual-plan" element={<AnnualPlan />} />
          <Route path="/question-paper" element={<QuestionPaper />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/gradebook" element={<Gradebook />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/parent-comm" element={<ParentComm />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/rubric" element={<RubricGenerator />} />
          <Route path="/report-card" element={<ReportCard />} />
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <VoiceProvider>
          <AppShell />
        </VoiceProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
