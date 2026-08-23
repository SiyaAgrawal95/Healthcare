import { useState, useEffect } from 'react'
import { getExplanation, availableParameters } from '../services/explanationApi'

interface ExplanationData {
  parameter: string
  detectedValue: string
  generalSignificance: string
  possibleAssociatedFactors: string[]
  whatToDiscuss: string
}

export default function ExplainResults() {
  const [selectedParameter, setSelectedParameter] = useState('glucose')
  const [explanation, setExplanation] = useState<ExplanationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExplanation()
  }, [selectedParameter])

  const fetchExplanation = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getExplanation(selectedParameter)
      setExplanation(data)
    } catch (err) {
      setError('Failed to load explanation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const parameterLabels: Record<string, string> = {
    glucose: 'Glucose',
    protein: 'Protein',
    ph: 'pH',
    ketones: 'Ketones',
    blood: 'Blood'
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: '#475569' }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
            Explain Abnormal Results
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            Understand what an abnormal urine parameter may indicate
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Parameter Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>
                Select Parameter
              </h2>
              <div className="space-y-2">
                {availableParameters.map((param) => (
                  <button
                    key={param}
                    onClick={() => setSelectedParameter(param)}
                    disabled={loading}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedParameter === param
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {parameterLabels[param]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#0F4C81' }}></div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!loading && !error && explanation && (
                <div className="space-y-6">
                  {/* Parameter Header */}
                  <div className="pb-4 border-b border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Parameter</div>
                    <div className="text-2xl font-bold" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>
                      {explanation.parameter}
                    </div>
                  </div>

                  {/* Detected Value */}
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#EAF7FA' }}>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Detected Value</div>
                      <div className="font-semibold" style={{ color: '#0F4C81' }}>
                        {explanation.detectedValue}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#0F4C81' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* General Significance */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#0F4C81' }}>
                      General Significance
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                      {explanation.generalSignificance}
                    </p>
                  </div>

                  {/* Possible Associated Factors */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#0F4C81' }}>
                      Possible Associated Factors
                    </div>
                    <ul className="space-y-2">
                      {explanation.possibleAssociatedFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm" style={{ color: '#64748b' }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#27AE60' }} />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What to Discuss */}
                  <div className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#0F4C81' }}>
                      What to Discuss With a Healthcare Professional
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                      {explanation.whatToDiscuss}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                  This information is for general educational purposes only and is not a medical diagnosis or a substitute for professional medical advice. Always consult with a qualified healthcare provider for interpretation of your test results and appropriate medical care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
