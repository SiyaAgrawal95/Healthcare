import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Compare from './pages/Compare.jsx'
import History from './pages/History'
import ExplainResults from './pages/ExplainResults'
import Sidebar from './components/Sidebar'

// ─── App with Routing ────────────────────────────────────────────────────────
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Hamburger Menu - Fixed in top-left */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 left-4 z-40 p-3 rounded-xl bg-white shadow-lg border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        style={{ boxShadow: '0 4px 12px rgba(15, 76, 129, 0.15)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6" style={{ color: '#0F4C81' }}>
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
        <Route path="/explain" element={<ExplainResults />} />
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
