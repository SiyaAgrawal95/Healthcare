import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Compare from './pages/Compare.jsx'
import History from './pages/History'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import PatientDetails from './pages/PatientDetails.jsx'
import Sidebar from './components/Sidebar'
import AIExplanation from "./pages/AIExplanation";
import UploadStrip from "./pages/UploadStrip";


// ─── App with Routing ────────────────────────────────────────────────────────
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isLandingPage = location.pathname === '/' || location.pathname === '/dashboard'

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Hamburger Menu - Fixed with clean contextual placement */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed z-40 p-2.5 rounded-xl bg-white shadow-md border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
          isLandingPage ? 'top-20 left-4' : 'top-5 left-5'
        }`}
        style={{ boxShadow: '0 4px 12px rgba(15, 76, 129, 0.12)' }}
        aria-label="Open Navigation Menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" style={{ color: '#0F4C81' }}>
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
        <Route path="/ai-explanation" element={<AIExplanation />} />
        <Route path="/upload-strip" element={<UploadStrip />} />
        <Route path="/upload" element={<UploadStrip />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
