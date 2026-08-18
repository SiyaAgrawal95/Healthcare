import { useState, useEffect, useRef } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconAccuracy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
  </svg>
)
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)
const IconReport = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconPortable = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const IconHospital = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" /><path d="M12 8v8M8 12h8" />
  </svg>
)
const IconLab = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-5 5m5-5h6m0 0l5 5M15 14V3" />
  </svg>
)
const IconClinic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const IconEmergency = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV = ['Technology', 'Features', 'Applications', 'About', 'Contact']

const FEATURES = [
  { icon: <IconAccuracy />, title: 'High Accuracy', desc: 'AI-assisted colorimetric interpretation delivers consistent, reproducible diagnostic results that match reference laboratory standards.' },
  { icon: <IconClock />, title: 'Rapid Results', desc: 'Complete urinalysis in under 60 seconds — from strip insertion to structured report generation, with no manual reading.' },
  { icon: <IconLayers />, title: 'Multi-Parameter Testing', desc: 'Simultaneously measures 10 parameters: Protein, Glucose, Blood, Ketones, Nitrite, Leukocytes, pH, Specific Gravity, Bilirubin, Urobilinogen.' },
  { icon: <IconReport />, title: 'Digital Reports', desc: 'Automatically generates structured patient reports with flagged values, trend data, and export options for EHR integration.' },
  { icon: <IconPortable />, title: 'Portable Point-of-Care', desc: 'Compact, lightweight design suitable for hospitals, clinics, laboratories, and mobile healthcare outreach units.' },
  { icon: <IconLock />, title: 'Secure Data Management', desc: 'Patient records stored with AES-256 encryption, HIPAA-compliant access controls, and full audit trail.' },
]

const STEPS = [
  {
    num: '01', title: 'Collect Urine Sample',
    desc: 'Collect a midstream urine sample using a sterile container following standard clinical protocol.',
    icon: '🧪'
  },
  {
    num: '02', title: 'Dip Test Strip',
    desc: 'Submerge the reagent strip in the sample for 2 seconds, then remove and blot excess urine.',
    icon: '📏'
  },
  {
    num: '03', title: 'Insert Strip into Reader',
    desc: 'Place the strip face-up into the device slot. The reader auto-detects the strip and begins imaging.',
    icon: '⚙️'
  },
  {
    num: '04', title: 'AI Colorimetric Analysis',
    desc: 'The integrated optical sensor captures the strip. AI algorithms compare color values against calibrated reference standards.',
    icon: '🤖'
  },
  {
    num: '05', title: 'Generate Digital Report',
    desc: 'A structured diagnostic report is instantly generated, flagging abnormal values and ready for physician review.',
    icon: '📋'
  },
]

const APPLICATIONS = [
  { icon: <IconHospital />, title: 'Hospitals', desc: 'Streamline high-volume urinalysis workflows across wards, nephrology, and emergency departments without lab delays.' },
  { icon: <IconLab />, title: 'Clinical Laboratories', desc: 'Automate routine urinalysis with consistent AI-driven results, reducing analyst workload and inter-operator variability.' },
  { icon: <IconClinic />, title: 'Primary Healthcare Centers', desc: 'Bring point-of-care diagnostics to remote and resource-limited settings with a compact, battery-operable device.' },
  { icon: <IconEmergency />, title: 'Emergency Care Units', desc: 'Accelerate triage decisions with rapid urinalysis results at bedside, eliminating the central lab turnaround bottleneck.' },
]

const BENEFITS = [
  'Accurate Results — AI eliminates inter-reader variability',
  'Easy to Operate — minimal training required for staff',
  'AI-powered Analysis — calibrated colorimetric algorithms',
  'Fast Diagnosis — results in under 60 seconds',
  'Point-of-Care Ready — deploy anywhere care is delivered',
  'Reduced Human Error — automated strip interpretation',
  'Reliable 24×7 Operation — industrial-grade optical system',
]

const STATS = [
  { value: 98, suffix: '%', label: 'Diagnostic Accuracy' },
  { value: 10, suffix: '+', label: 'Urine Parameters' },
  { value: 1000, suffix: '+', label: 'Daily Tests Supported' },
  { value: 24, suffix: '×7', label: 'Reliable Operation' },
]

const TESTIMONIALS = [
  {
    name: 'Dr. Arun Mehta',
    role: 'Senior Nephrologist, AIIMS New Delhi',
    quote: 'The colorimetric precision of this device matches our central lab within 2% across all 10 parameters. It has fundamentally changed how we handle rapid renal assessments in our ward.',
    initials: 'AM',
    color: '#0F4C81'
  },
  {
    name: 'Ms. Priyanka Rao',
    role: 'Senior Lab Technician, Manipal Hospitals',
    quote: 'Our urinalysis throughput has tripled since deployment. The strip reader eliminates manual colorimetric reading errors completely — the AI is genuinely impressive.',
    initials: 'PR',
    color: '#27AE60'
  },
  {
    name: 'Mr. Sanjay Verma',
    role: 'Hospital Administrator, Apollo Healthcare Group',
    quote: 'Procurement was straightforward and ROI was evident within the first quarter. Reduced lab turnaround time by 78% for urinalysis with no increase in staffing.',
    initials: 'SV',
    color: '#0F4C81'
  },
]

const FAQS = [
  {
    q: 'How does colorimetric analysis work?',
    a: 'The device uses an integrated optical imaging sensor to capture high-resolution images of the reagent pads on the test strip. Proprietary AI algorithms compare the detected color values — expressed as CIE L*a*b* coordinates — against factory-calibrated reference standards for each parameter, accounting for ambient lighting and strip lot variations.'
  },
  {
    q: 'How many parameters can be tested simultaneously?',
    a: 'The device simultaneously evaluates 10 urine parameters from a single strip: Protein, Glucose, Blood (hemoglobin), Ketones, Nitrite, Leukocytes, pH, Specific Gravity, Bilirubin, and Urobilinogen. Results for all parameters are available within one analysis cycle.'
  },
  {
    q: 'Is the device suitable for hospital-scale deployment?',
    a: 'Yes. The system is designed for continuous operation in high-volume clinical environments. It supports 1000+ daily tests, integrates with HL7 FHIR-compliant EHR systems, and includes a central dashboard for fleet management across multiple departments or facilities.'
  },
  {
    q: 'How long does one complete test take?',
    a: 'From strip insertion to report generation, the total analysis cycle takes under 60 seconds. Strip reading itself takes approximately 30 seconds. The remaining time covers AI processing, result validation, and report formatting.'
  },
  {
    q: 'Is calibration required?',
    a: 'The device performs automatic self-calibration at startup using an internal reference tile. Periodic external calibration using the provided calibration strip kit is recommended every 30 days or after significant environmental changes. Calibration events are logged automatically.'
  },
  {
    q: 'Can reports be exported digitally?',
    a: 'Yes. Reports are exported in PDF, CSV, and HL7 FHIR formats. The device supports Wi-Fi, Ethernet, and USB connectivity. Direct integration with major LIS/EHR platforms (Epic, Cerner, Meditech) is available through the companion middleware.'
  },
]

const PARTNERS = ['Siemens Healthineers', 'AIIMS', 'Apollo Hospitals', 'Manipal Health', 'Narayana Health', 'NHS India', 'ICMR']

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, trigger])
  return count
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const count = useCounter(value, 1800, triggered)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="text-center text-white">
      <div className="text-5xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {count}{suffix}
      </div>
      <div className="text-blue-200 text-sm font-medium">{label}</div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white" style={{ color: '#475569' }}>

      {/* ══ NAVIGATION ══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0F4C81' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-5 5m5-5h6m0 0l5 5M15 14V3" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-base leading-tight" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
                ChromaDx<span style={{ color: '#0F4C81' }}>™</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI Urine Analyzer</div>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-[#0F4C81] transition-colors">{l}</a>
            ))}
          </div>

          <div className="hidden lg:block">
            <button
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1a5a94)' }}
            >
              Request Demo
            </button>
          </div>

          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-700">
              {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#0F4C81]">{l}</a>
            ))}
            <button className="mt-1 py-3 rounded-lg text-white text-sm font-semibold" style={{ background: '#0F4C81' }}>
              Request Demo
            </button>
          </div>
        )}
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-24 px-6" style={{ background: 'linear-gradient(150deg, #f0f6ff 0%, #EAF7FA 50%, #f8fafc 100%)' }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: 'linear-gradient(#0F4C8108 1px, transparent 1px), linear-gradient(90deg, #0F4C8108 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7 border" style={{ background: '#EAF7FA', color: '#0F4C81', borderColor: '#0F4C8120' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#27AE60' }} />
              Point-of-Care Diagnostic Technology
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-[1.15] mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              AI-Powered<br />
              <span style={{ color: '#0F4C81' }}>Urine Test Strip</span><br />
              Reader
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: '#475569' }}>
              Accurate, fast, and reliable urine analysis using advanced colorimetric technology for Point-of-Care diagnostics in hospitals, labs, and clinics.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button className="px-7 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:opacity-95 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1a5a94)', boxShadow: '0 8px 24px #0F4C8130' }}>
                Request Demo
              </button>
              <button className="px-7 py-3.5 rounded-xl font-semibold border-2 transition-all hover:bg-[#0F4C8108] active:scale-95 flex items-center gap-2"
                style={{ borderColor: '#0F4C81', color: '#0F4C81' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16 10,8" fill="currentColor" stroke="none" /></svg>
                Learn More
              </button>
            </div>
            {/* Trust signals */}
            <div className="flex items-center gap-6 text-sm" style={{ color: '#64748b' }}>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" className="w-4 h-4"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 1.2-.504 2.4-1.4 3.2l-7.6 6.8-7.6-6.8A5 5 0 013 12V5.5L12 2l9 3.5V12z" /></svg>
                CE Marked
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" className="w-4 h-4"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 1.2-.504 2.4-1.4 3.2l-7.6 6.8-7.6-6.8A5 5 0 013 12V5.5L12 2l9 3.5V12z" /></svg>
                CLIA Waived
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" className="w-4 h-4"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 1.2-.504 2.4-1.4 3.2l-7.6 6.8-7.6-6.8A5 5 0 013 12V5.5L12 2l9 3.5V12z" /></svg>
                ISO 13485
              </div>
            </div>
          </div>

          {/* Right — Device visualization */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, #0F4C81, transparent 70%)' }} />
              {/* Main device image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white" style={{ aspectRatio: '4/3', background: '#EAF7FA' }}>
                <img
                  src="https://images.unsplash.com/photo-1663354876870-6282cb0a8843?w=800&h=600&fit=crop&auto=format"
                  alt="ChromaDx AI Urine Test Strip Reader device"
                  className="w-full h-full object-cover"
                />
                {/* Overlay label */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C8180] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Analysis Complete</div>
                      <div className="text-sm font-bold" style={{ color: '#1E293B' }}>10 Parameters — Normal Range</div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#27AE60' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -left-6 top-8 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Analysis Speed</div>
                <div className="text-xl font-bold" style={{ fontFamily: 'Poppins', color: '#0F4C81' }}>&lt; 60s</div>
                <div className="text-xs text-slate-400">per test cycle</div>
              </div>
              <div className="absolute -right-6 bottom-12 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Accuracy Rate</div>
                <div className="text-xl font-bold" style={{ fontFamily: 'Poppins', color: '#27AE60' }}>98%</div>
                <div className="text-xs text-slate-400">vs. reference lab</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUSTED BY ══════════════════════════════════════════════════════════ */}
      <div className="border-y border-slate-100 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-6">Trusted by Healthcare Professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            {PARTNERS.map(p => (
              <span key={p} className="text-slate-300 font-semibold text-sm hover:text-slate-500 transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ ABOUT THE DEVICE ════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Device illustration */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100" style={{ background: '#F8FAFC', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=700&h=525&fit=crop&auto=format"
                alt="Laboratory scientist performing urinalysis"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Component labels */}
            <div className="absolute top-6 right-4 space-y-2">
              {['Optical Sensor', 'AI Processor', 'Strip Slot', 'Display'].map((c, i) => (
                <div key={c} className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold border border-slate-100 shadow-sm flex items-center gap-2"
                  style={{ color: '#0F4C81' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? '#0F4C81' : '#27AE60' }} />
                  {c}
                </div>
              ))}
            </div>
          </div>
          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>About the Device</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              What is the<br /><span style={{ color: '#0F4C81' }}>Urine Test Strip Reader?</span>
            </h2>
            <p className="leading-relaxed mb-8" style={{ color: '#475569' }}>
              The AI-powered Urine Test Strip Reader uses advanced colorimetric analysis to accurately interpret urine test strips. The system minimizes manual interpretation errors by automatically detecting color variations across all reagent pads and generating fast, reliable diagnostic reports suitable for Point-of-Care healthcare environments.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Integrated Optical Imaging', desc: 'Multi-spectral LED illumination and CCD sensor capture high-fidelity strip images.' },
                { title: 'Calibrated AI Algorithms', desc: 'CIE L*a*b* colorimetry with per-lot calibration ensures batch-independent accuracy.' },
                { title: 'Instant Report Generation', desc: 'Structured HL7-compliant reports delivered to LIS/EHR in under 60 seconds.' },
              ].map(f => (
                <div key={f.title} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#0F4C8120] hover:shadow-sm transition-all">
                  <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: '#EAF7FA' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0F4C81" strokeWidth="2" className="w-4 h-4"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5" style={{ color: '#1E293B' }}>{f.title}</div>
                    <div className="text-sm" style={{ color: '#64748b' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════════ */}
      <section id="technology" className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>Workflow</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              How It Works
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: '#64748b' }}>
              Five streamlined steps from sample collection to digital report — designed for clinical efficiency.
            </p>
          </div>
          {/* Steps */}
          <div className="relative">
            <div className="hidden lg:block absolute top-14 left-[calc(10%+28px)] right-[calc(10%+28px)] h-px" style={{ background: 'linear-gradient(90deg, #0F4C8140, #27AE6060, #0F4C8140)' }} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {STEPS.map((s, i) => (
                <div key={s.num} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#0F4C8120] transition-all text-center relative">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-4 shadow-md"
                    style={{ background: i % 2 === 0 ? '#0F4C81' : '#27AE60' }}>
                    {s.num}
                  </div>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TECHNOLOGY SECTION ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#27AE60' }}>Core Technology</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Advanced AI Colorimetric Analysis
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#64748b' }}>
              The device captures the urine strip image using an integrated optical imaging system. AI algorithms compare detected color variations with calibrated reference values to accurately determine multiple urine parameters while minimizing human interpretation errors.
            </p>
          </div>
          {/* Pipeline */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🎨', title: 'Color Spectrum Capture', desc: 'Multi-spectral LED array illuminates the strip. CCD sensor captures high-resolution CIE L*a*b* color data from all 10 reagent pads.', color: '#0F4C81' },
              { step: '2', icon: '🔬', title: 'Optical Sensing', desc: 'Calibrated reference tile corrects for ambient light, temperature drift, and strip lot-to-lot variation before analysis.', color: '#27AE60' },
              { step: '3', icon: '🤖', title: 'AI Processing', desc: 'Deep learning model compares detected color coordinates against a reference database of 2M+ validated strip readings.', color: '#0F4C81' },
              { step: '4', icon: '📊', title: 'Digital Report', desc: 'Structured report with quantified parameter values, normal range flags, and trend comparison is generated and transmitted to LIS.', color: '#27AE60' },
            ].map(t => (
              <div key={t.step} className="rounded-2xl p-7 border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: t.color }} />
                <div className="text-3xl mb-4">{t.icon}</div>
                <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>{t.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Built for Clinical Excellence
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#64748b' }}>
              Every feature engineered for the demands of professional healthcare diagnostics.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-[#0F4C8130] hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: '#EAF7FA', color: '#0F4C81' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APPLICATIONS ════════════════════════════════════════════════════════ */}
      <section id="applications" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>Applications</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Deployed Across<br /><span style={{ color: '#0F4C81' }}>Every Care Setting</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPLICATIONS.map((a, i) => (
              <div key={a.title} className="rounded-2xl p-8 border hover:shadow-xl transition-all group cursor-default"
                style={{ borderColor: i % 2 === 0 ? '#0F4C8115' : '#27AE6015', background: i % 2 === 0 ? '#f8fbff' : '#f6fdf9' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-105"
                  style={{ background: i % 2 === 0 ? '#EAF7FA' : '#e8faf2', color: i % 2 === 0 ? '#0F4C81' : '#27AE60' }}>
                  {a.icon}
                </div>
                <h3 className="font-bold mb-3" style={{ fontFamily: 'Poppins', color: '#1E293B' }}>{a.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENEFITS ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1606206591513-adbfbdd7a177?w=700&h=525&fit=crop&auto=format"
              alt="Clinical diagnostics equipment"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>Benefits</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-8" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Why clinicians choose<br /><span style={{ color: '#0F4C81' }}>ChromaDx™</span>
            </h2>
            <div className="space-y-4">
              {BENEFITS.map(b => {
                const [title, rest] = b.split(' — ')
                return (
                  <div key={b} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-[#0F4C8120] hover:shadow-sm transition-all">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                      style={{ background: '#27AE60' }}>✓</div>
                    <div className="text-sm" style={{ color: '#475569' }}>
                      <span className="font-semibold" style={{ color: '#1E293B' }}>{title}</span>
                      {rest && <span> — {rest}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATISTICS ══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #0F4C81, #1a5a94)' }}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Trusted by<br /><span style={{ color: '#0F4C81' }}>healthcare professionals</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all relative">
                <div className="absolute top-6 right-6 text-5xl font-serif text-slate-100 leading-none select-none">"</div>
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-sm leading-relaxed mb-7 italic" style={{ color: '#64748b' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-slate-50 pt-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#94a3b8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#0F4C81' }}>FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1E293B' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 font-semibold text-sm transition-colors"
                  style={{ color: openFaq === i ? '#0F4C81' : '#1E293B', fontFamily: 'Poppins' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <span className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all text-lg leading-none"
                    style={{
                      borderColor: openFaq === i ? '#0F4C81' : '#e2e8f0',
                      color: '#0F4C81',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none'
                    }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-6 text-sm leading-relaxed border-t border-slate-50" style={{ color: '#64748b' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden px-10 py-16 text-center"
            style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #0a3d6b 60%, #0F4C81 100%)' }}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#27AE60', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
              style={{ background: '#EAF7FA', transform: 'translate(-30%, 30%)' }} />
            {/* Medical cross pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'17\' y=\'8\' width=\'6\' height=\'24\' fill=\'white\'/%3E%3Crect x=\'8\' y=\'17\' width=\'24\' height=\'6\' fill=\'white\'/%3E%3C/svg%3E")',
                backgroundSize: '60px 60px'
              }} />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/20"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#27AE60' }} />
                Available for institutional procurement
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5" style={{ fontFamily: 'Poppins' }}>
                Experience Faster and More<br />Accurate Urine Diagnostics
              </h2>
              <p className="text-blue-200 mb-8 max-w-xl mx-auto text-sm">
                Schedule a live demonstration with our clinical specialists and see ChromaDx™ perform a full 10-parameter analysis in your facility.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-9 py-4 rounded-xl font-bold text-[#0F4C81] bg-white hover:bg-blue-50 active:scale-95 transition-all shadow-lg text-sm">
                  Request a Live Demo →
                </button>
                <button className="px-9 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all text-sm">
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0F4C81' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-5 5m5-5h6m0 0l5 5M15 14V3" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white" style={{ fontFamily: 'Poppins' }}>ChromaDx™</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">AI Urine Analyzer</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                AI-powered point-of-care urine test strip analysis for hospitals, laboratories, and clinical settings.
              </p>
              <div className="flex gap-2.5">
                {['tw', 'li', 'yt', 'fb'].map(s => (
                  <button key={s} className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500 hover:border-[#0F4C81] hover:text-[#0F4C81] transition-colors uppercase">{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: 'Poppins' }}>Quick Links</h4>
              <div className="space-y-2.5">
                {['Technology', 'Features', 'Applications', 'Support', 'Contact'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: 'Poppins' }}>Legal</h4>
              <div className="space-y-2.5">
                {['Privacy Policy', 'Terms & Conditions', 'Medical Disclaimer', 'CE Documentation', 'ISO Certificates'].map(l => (
                  <a key={l} href="#" className="block text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: 'Poppins' }}>Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>info@chromadx.health</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>+91 80 4567 8900</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Biotech Park, Whitefield<br />Bengaluru 560066, India</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <span>© 2026 ChromaDx Health Technologies Pvt. Ltd. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              CE Marked · ISO 13485 · CLIA Waived · HIPAA Compliant
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
