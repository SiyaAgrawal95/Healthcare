import { useState } from 'react'

export default function Compare() {
  const [selectedParameter, setSelectedParameter] = useState('glucose')

  const parameters = [
    { id: 'glucose', name: 'Glucose', normal: 'Negative', unit: 'mg/dL' },
    { id: 'protein', name: 'Protein', normal: 'Negative', unit: 'mg/dL' },
    { id: 'ph', name: 'pH', normal: '4.5 - 8.0', unit: '' },
    { id: 'ketones', name: 'Ketones', normal: 'Negative', unit: 'mg/dL' },
    { id: 'blood', name: 'Blood', normal: 'Negative', unit: 'RBC/μL' },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ color: '#475569' }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
            Compare Urine Parameters
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            Compare your test results with normal reference ranges
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Parameter Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>
                Select Parameter
              </h2>
              <div className="space-y-2">
                {parameters.map((param) => (
                  <button
                    key={param.id}
                    onClick={() => setSelectedParameter(param.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedParameter === param.id
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {param.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <h2 className="font-bold mb-6" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>
                {parameters.find(p => p.id === selectedParameter)?.name} Comparison
              </h2>
              
              <div className="space-y-6">
                {/* Normal Range */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Normal Range</div>
                    <div className="font-semibold" style={{ color: '#1E293B' }}>
                      {parameters.find(p => p.id === selectedParameter)?.normal}
                      {parameters.find(p => p.id === selectedParameter)?.unit && (
                        <span className="text-slate-500 ml-1">
                          {parameters.find(p => p.id === selectedParameter)?.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#27AE60' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Your Result (placeholder) */}
                <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ borderColor: '#0F4C81', background: '#EAF7FA' }}>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Your Result</div>
                    <div className="font-semibold" style={{ color: '#0F4C81' }}>
                      {selectedParameter === 'glucose' && '+100 mg/dL'}
                      {selectedParameter === 'protein' && 'Trace'}
                      {selectedParameter === 'ph' && '6.5'}
                      {selectedParameter === 'ketones' && 'Negative'}
                      {selectedParameter === 'blood' && '+2'}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#0F4C81' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 rounded-xl" style={{ background: selectedParameter === 'glucose' ? '#FEF2F2' : '#F0FDF4' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${selectedParameter === 'glucose' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: selectedParameter === 'glucose' ? '#DC2626' : '#16A34A' }}>
                      {selectedParameter === 'glucose' ? 'Abnormal' : 'Normal'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    {selectedParameter === 'glucose' 
                      ? 'Your glucose level is above the normal range. This may require further investigation.'
                      : 'Your result is within the normal reference range.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
