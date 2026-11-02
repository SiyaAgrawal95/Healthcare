import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'
import { saveUrineTest } from '../services/urineTestApi'
import '../styles/UploadStrip.css'

interface DetectedParam {
  name: string
  value: string
  status: 'Normal' | 'Abnormal'
}

const SAMPLE_NORMAL_STRIP = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'
const SAMPLE_ABNORMAL_STRIP = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'

const NORMAL_RESULTS: DetectedParam[] = [
  { name: 'Glucose', value: 'Negative', status: 'Normal' },
  { name: 'Protein', value: 'Negative', status: 'Normal' },
  { name: 'pH', value: '6.5', status: 'Normal' },
  { name: 'Ketones', value: 'Negative', status: 'Normal' },
  { name: 'Blood', value: 'Negative', status: 'Normal' },
  { name: 'Nitrite', value: 'Negative', status: 'Normal' },
  { name: 'Leukocytes', value: 'Negative', status: 'Normal' },
  { name: 'Spec. Gravity', value: '1.020', status: 'Normal' },
  { name: 'Bilirubin', value: 'Negative', status: 'Normal' },
  { name: 'Urobilinogen', value: '0.2 mg/dL', status: 'Normal' },
]

const ABNORMAL_RESULTS: DetectedParam[] = [
  { name: 'Glucose', value: 'Trace', status: 'Abnormal' },
  { name: 'Protein', value: 'Trace', status: 'Abnormal' },
  { name: 'pH', value: '6.2', status: 'Normal' },
  { name: 'Ketones', value: 'Moderate', status: 'Abnormal' },
  { name: 'Blood', value: 'Trace', status: 'Abnormal' },
  { name: 'Nitrite', value: 'Positive', status: 'Abnormal' },
  { name: 'Leukocytes', value: 'Trace', status: 'Abnormal' },
  { name: 'Spec. Gravity', value: '1.025', status: 'Normal' },
  { name: 'Bilirubin', value: 'Negative', status: 'Normal' },
  { name: 'Urobilinogen', value: '0.2 mg/dL', status: 'Normal' },
]

const BIOMARKERS_INFO = [
  {
    name: 'Glucose & Ketones',
    tag: 'Metabolic',
    desc: 'Assesses blood sugar regulation and ketosis. Key indicators for diabetes mellitus monitoring and metabolic stress.'
  },
  {
    name: 'Protein & Blood',
    tag: 'Renal Function',
    desc: 'Screens for microalbuminuria, glomerular filtration integrity, and hematuria (kidney stones or nephropathy).'
  },
  {
    name: 'Leukocytes & Nitrite',
    tag: 'UTI Screening',
    desc: 'Detects white blood cell esterase and gram-negative bacterial reductase activity for rapid point-of-care UTI screening.'
  },
  {
    name: 'pH & Specific Gravity',
    tag: 'Acid-Base & Hydration',
    desc: 'Evaluates urine acidity and renal concentrating ability/hydration balance (standard range: 1.005 - 1.030).'
  },
  {
    name: 'Bilirubin & Urobilinogen',
    tag: 'Liver & Biliary',
    desc: 'Identifies early signs of liver dysfunction, biliary obstruction, and hemolytic disorders.'
  }
]

export default function UploadStrip() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [scanStatusText, setScanStatusText] = useState<string>('')
  const [results, setResults] = useState<DetectedParam[] | null>(null)
  const [savedTestId, setSavedTestId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [activeInfoTab, setActiveInfoTab] = useState<'guidelines' | 'biomarkers' | 'tech'>('guidelines')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!currentUser?._id) navigate('/login')
  }, [currentUser?._id, navigate])

  const handleFileUpload = (file: File) => {
    if (!file) return
    setFileName(file.name)
    setResults(null)
    setSavedTestId(null)
    setSaveError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const loadSample = (type: 'normal' | 'abnormal') => {
    setResults(null)
    setSavedTestId(null)
    setSaveError('')
    if (type === 'normal') {
      setImageSrc(SAMPLE_NORMAL_STRIP)
      setFileName('Sample_Normal_Strip_10SG.jpg')
    } else {
      setImageSrc(SAMPLE_ABNORMAL_STRIP)
      setFileName('Sample_Abnormal_Strip_10SG.jpg')
    }
  }

  const buildDemoPayload = (detected: DetectedParam[]) => {
    const parameterNames: Record<string, string> = {
      'Glucose': 'glucose', 'Protein': 'protein', 'pH': 'ph', 'Ketones': 'ketones',
      'Blood': 'blood', 'Nitrite': 'nitrite', 'Leukocytes': 'leukocytes',
      'Spec. Gravity': 'specificGravity', 'Bilirubin': 'bilirubin', 'Urobilinogen': 'urobilinogen',
    }
    const numericNames = new Set(['pH', 'Spec. Gravity', 'Urobilinogen'])
    const units: Record<string, string> = { 'pH': 'pH', 'Spec. Gravity': 'specific gravity', 'Urobilinogen': 'mg/dL' }
    const parameters = detected.map((item) => {
      const numeric = numericNames.has(item.name)
      const value = numeric ? Number.parseFloat(item.value) : item.value.toLowerCase()
      return {
        name: parameterNames[item.name],
        value,
        status: item.status.toLowerCase(),
        ...(units[item.name] ? { unit: units[item.name] } : {}),
        ...(!numeric ? { interpretation: value } : {}),
      }
    })
    const flags = detected.filter((item) => item.status === 'Abnormal').map((item) => `${item.name}: ${item.value}`)
    return {
      observedAt: new Date().toISOString(),
      source: 'demo',
      stripManufacturer: 'Unspecified demo strip',
      parameters,
      analysis: {
        status: 'complete',
        summary: 'SIMULATED DEMO OUTPUT. The uploaded image was not analyzed by a colorimetry model.',
        flags,
        recommendations: [],
        modelName: 'frontend-demo-simulator',
        modelVersion: '1.0',
        analyzedAt: new Date().toISOString(),
      },
      notes: 'Synthetic preview record only. Not measured from the uploaded image and not for clinical use.',
    }
  }

  const runAnalysis = async () => {
    if (!imageSrc || isScanning || !currentUser?._id) return
    setIsScanning(true)
    setSaveError('')
    setSavedTestId(null)
    setScanProgress(15)
    setScanStatusText('Preparing the uploaded image for a demo run...')
    const pause = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))
    try {
      await pause(500)
      setScanProgress(50)
      setScanStatusText('Generating a preset demo result...')
      await pause(500)
      const detected = fileName.toLowerCase().includes('abnormal') ? ABNORMAL_RESULTS : NORMAL_RESULTS
      setResults(detected)
      setScanProgress(85)
      setScanStatusText('Saving the demo observation to your test history...')
      const savedTest = await saveUrineTest(currentUser._id, buildDemoPayload(detected))
      setSavedTestId(savedTest.id)
      setScanProgress(100)
      setScanStatusText('Demo result saved to your test history.')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save the demo result.')
      setScanStatusText('Could not save the demo result.')
    } finally {
      setIsScanning(false)
    }
  }

  const clearImage = () => {
    setImageSrc(null)
    setFileName('')
    setResults(null)
    setSavedTestId(null)
    setSaveError('')
    setIsScanning(false)
    setScanProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const abnormalCount = results ? results.filter(r => r.status === 'Abnormal').length : 0

  if (!currentUser) return null

  return (
    <div className="upload-strip-page">
      {/* Header */}
      <header className="upload-strip-header">
        <div>
          <p className="eyebrow">AI OPTICAL COLORIMETRIC SCANNER</p>
          <h1>Upload Urine Test Strip</h1>
          <p>
            Upload a strip image to create a clearly labeled demo record. Real image colorimetry is not connected yet.
          </p>
        </div>
        <div className="tech-badge">
          Demo mode
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="upload-strip-container">
        {/* Left Column: Upload & Scan View */}
        <div className="upload-card">
          <div className="upload-card-title">
            <h2>Test Strip Image</h2>
            <p>Upload a horizontal image of your reagent strip taken under balanced lighting.</p>
          </div>

          {!imageSrc ? (
            <div>
              <div
                className={`dropzone ${isDragOver ? 'dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3>Drag & drop your test strip photo here</h3>
                <p>Supports PNG, JPG, or JPEG (Max 15MB)</p>
                <span className="dropzone-btn">Browse Files</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Sample Presets */}
              <div className="sample-presets">
                <span>Or load sample test strips:</span>
                <button
                  type="button"
                  className="sample-preset-btn"
                  onClick={() => loadSample('normal')}
                >
                  🧪 Sample Normal Strip
                </button>
                <button
                  type="button"
                  className="sample-preset-btn"
                  onClick={() => loadSample('abnormal')}
                >
                  ⚠️ Sample Abnormal Strip
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="preview-container">
                <img src={imageSrc} alt="Urine Test Strip Preview" className="preview-image" />
                {isScanning && (
                  <div className="scanning-overlay">
                    <div className="laser-line"></div>
                  </div>
                )}
                <div className="scan-hud">
                  <div className="scan-badge-active">
                    <span className="pulse-dot"></span>
                    <span>{fileName}</span>
                  </div>
                  <span>{isScanning ? 'SCANNING...' : 'READY'}</span>
                </div>
              </div>

              {isScanning && (
                <div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                  <div className="progress-status-text">{scanStatusText}</div>
                </div>
              )}

              {!isScanning && (
                <div className="preview-actions">
                  <button type="button" className="action-btn-analyze" onClick={runAnalysis}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    {results ? 'Generate Another Demo Result' : 'Generate & Save Demo Result'}
                  </button>
                  <button type="button" className="action-btn-clear" onClick={clearImage}>
                    Change Image
                  </button>
                </div>
              )}

              {/* Detected Results Card */}
              {results && (
                <div className={`results-card ${abnormalCount > 0 ? 'has-abnormal' : ''}`}>
                  <div className="results-header">
                    <div>
                      <h3>Simulated Demo Readings</h3>
                      <span style={{ fontSize: '12px', color: abnormalCount > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                        {abnormalCount > 0 ? `⚠️ ${abnormalCount} Abnormal Finding(s) Detected` : '✓ All 10 Parameters in Normal Range'}
                      </span>
                    </div>
                    {savedTestId && <span className="results-confidence">Saved to MongoDB</span>}
                  </div>

                  <p className="demo-disclaimer">These preset values were not measured from the uploaded image. They are saved as synthetic demo data, not clinical results.</p>
                  {saveError && <div className="error-banner" role="alert">Result was not saved: {saveError}</div>}

                  <div className="parameters-grid">
                    {results.map((param) => (
                      <div
                        key={param.name}
                        className={`param-box ${param.status === 'Abnormal' ? 'param-abnormal' : ''}`}
                      >
                        <span className="param-name">{param.name}</span>
                        <span className="param-val">{param.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3 Action Buttons: AI Explanation, Compare, and History */}
                  <div className="results-actions">
                    <Link
                      to="/ai-explanation"
                      className={`nav-cta-btn ${abnormalCount > 0 ? 'nav-cta-highlight' : 'nav-cta-primary'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M12 3a7 7 0 00-7 7c0 2.5 1.3 4.2 3 5.5V19a2 2 0 002 2h4a2 2 0 002-2v-3.5c1.7-1.3 3-3 3-5.5a7 7 0 00-7-7z" />
                        <path d="M9 19h6" />
                      </svg>
                      AI Explanation
                    </Link>
                    <Link to="/compare" className="nav-cta-btn nav-cta-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                      </svg>
                      Compare Tests
                    </Link>
                    <Link to="/history" className="nav-cta-btn nav-cta-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      History Trends
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Clean De-Cluttered Info Card with Tabs */}
        <div className="info-column">
          <div className="info-tabbed-card">
            {/* Info Tabs Navigation */}
            <div className="info-nav-tabs">
              <button
                type="button"
                className={`info-tab-btn ${activeInfoTab === 'guidelines' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('guidelines')}
              >
                💡 Photo Tips
              </button>
              <button
                type="button"
                className={`info-tab-btn ${activeInfoTab === 'biomarkers' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('biomarkers')}
              >
                🔬 Biomarkers
              </button>
              <button
                type="button"
                className={`info-tab-btn ${activeInfoTab === 'tech' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('tech')}
              >
                ⚡ AI Engine
              </button>
            </div>

            {/* Tab 1: Photo Guidelines */}
            {activeInfoTab === 'guidelines' && (
              <div className="tab-pane">
                <div className="pane-header">
                  <h3>Photo Guidelines for 100% Accuracy</h3>
                  <p>Follow these 4 steps for optimal colorimetric calibration</p>
                </div>
                <div className="tips-list">
                  <div className="tip-item">
                    <span className="tip-number">1</span>
                    <div className="tip-content">
                      <strong>Read at Exactly 60 Seconds</strong>
                      <p>Enzymatic color development stabilizes between 60–90 seconds. Avoid scanning over-oxidized pads.</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <span className="tip-number">2</span>
                    <div className="tip-content">
                      <strong>Balanced, Diffused Light</strong>
                      <p>Avoid direct flash or heavy shadows. Natural daylight or white room light provides optimal color fidelity.</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <span className="tip-number">3</span>
                    <div className="tip-content">
                      <strong>Neutral White Background</strong>
                      <p>Place the strip horizontally on a clean white paper towel or neutral background.</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <span className="tip-number">4</span>
                    <div className="tip-content">
                      <strong>Prevent Reagent Runover</strong>
                      <p>Tap the edge briefly on tissue before laying flat to prevent pad-to-pad cross-contamination.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Biomarkers Guide */}
            {activeInfoTab === 'biomarkers' && (
              <div className="tab-pane">
                <div className="pane-header">
                  <h3>10-Parameter Biomarker Guide</h3>
                  <p>Clinical diagnostic overview of tested urine biomarkers</p>
                </div>
                <div className="biomarker-accordion">
                  {BIOMARKERS_INFO.map((item, idx) => (
                    <div key={idx} className="biomarker-item">
                      <div className="biomarker-header">
                        <span className="biomarker-name">{item.name}</span>
                        <span className="biomarker-tag">{item.tag}</span>
                      </div>
                      <p className="biomarker-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: AI Engine Info */}
            {activeInfoTab === 'tech' && (
              <div className="tab-pane tech-tab-pane">
                <div className="pane-header">
                  <h3>Neural Colorimetric Engine</h3>
                  <p>Hospital-grade optical reading architecture</p>
                </div>
                <p className="tech-desc">
                  Our model converts raw RGB pixels into device-independent <strong>CIE L*a*b*</strong> coordinates, performing illuminant D65 normalization to remove ambient lighting variance.
                </p>
                <div className="tech-stat-grid">
                  <div className="tech-stat-box">
                    <strong>&lt; 3s</strong>
                    <span>Processing Latency</span>
                  </div>
                  <div className="tech-stat-box">
                    <strong>98.6%</strong>
                    <span>Optical Accuracy</span>
                  </div>
                  <div className="tech-stat-box">
                    <strong>10 Pads</strong>
                    <span>Simultaneous Scan</span>
                  </div>
                  <div className="tech-stat-box">
                    <strong>CLIA / CE</strong>
                    <span>Standard Compliant</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

