export default function History() {
  return (
    <div className="min-h-screen bg-white" style={{ color: '#475569' }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
            Test History
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            View your previous urine test records
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#EAF7FA' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#0F4C81" strokeWidth="1.5" className="w-10 h-10">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
            No previous test records available
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#64748b' }}>
            Your test history will appear here once you start using the URINEX urine test strip reader.
          </p>
        </div>
      </div>
    </div>
  )
}
