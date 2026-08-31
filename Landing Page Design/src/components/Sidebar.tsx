import { Link } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/authService'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logout()
    onClose()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0F4C81' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-5 5m5-5h6m0 0l5 5M15 14V3" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
                  URINEX
                </div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">AI Health Monitoring</div>
              </div>
            </div>
            {currentUser && (
              <div className="text-xs text-slate-600 bg-[#F8FAFC] rounded-lg px-3 py-2">
                <div className="font-semibold">{currentUser.fullName}</div>
                <div className="text-slate-400">ID: {currentUser.patientId}</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/patient-details"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Details
              </Link>

              <Link
                to="/compare"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare
              </Link>

              <Link
                to="/history"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                History
              </Link>

              <Link
                to="/upload-strip"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Test Strip
              </Link>

              <Link
                to="/ai-explanation"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#EAF7FA] hover:text-[#0F4C81]"
                style={{ color: '#475569' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M12 3a7 7 0 00-7 7c0 2.5 1.3 4.2 3 5.5V19a2 2 0 002 2h4a2 2 0 002-2v-3.5c1.7-1.3 3-3 3-5.5a7 7 0 00-7-7z" />
                  <path d="M9 19h6" />
                </svg>
                AI Explanation
              </Link>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-red-50 hover:text-red-600"
                style={{ color: '#64748b' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
            <div className="text-xs text-slate-400 text-center mt-2">
              © 2026 URINEX Health
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
