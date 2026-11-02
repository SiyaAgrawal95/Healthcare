# URINEX - AI-Powered Urinalysis & Health Monitoring Platform

**URINEX** is an intelligent healthcare web application designed for rapid, accurate urinalysis test strip interpretation, health trend tracking, biomarker comparison, and AI-driven clinical explanations.

---

## 🌟 Key Features

- **📷 AI Test Strip Analysis (`/upload-strip`)**:
  - Upload or capture images of standard 10-parameter urinalysis reagent test strips.
  - Automated biomarker extraction & abnormal flag detection: *Glucose, Protein, pH, Ketones, Blood, Nitrite, Leukocytes, Specific Gravity, Bilirubin, and Urobilinogen*.
  - Immediate visual feedback with status indicators (Normal vs. Abnormal).

- **🧠 AI Explanation & Insights (`/ai-explanation`)**:
  - Contextual AI interpretation for detected biomarkers.
  - Explanations of potential contributing factors (e.g., diet, hydration, metabolic changes).
  - Clinical guidance and recommended follow-up actions for healthcare consultation.

- **📊 Longitudinal History & Trends (`/history`)**:
  - Visualized test timeline and parameter trends using interactive charts.
  - Filter by time period (Weekly, Monthly, Yearly).
  - Health status indicator (e.g., *Stable*, *Attention Required*).

- **⚖️ Side-by-Side Test Comparison (`/compare`)**:
  - Compare multiple urinalysis test dates side-by-side.
  - Track parameter changes over time to monitor recovery or progression.

- **👤 Patient Authentication & Profile (`/login`, `/signup`, `/patient-details`)**:
  - Secure patient login and registration with unique Patient IDs.
  - Patient health profile management and session persistence.

- **📱 Modern & Responsive UI**:
  - Polished healthcare design system with smooth transitions and sliding sidebar navigation.
  - Accessible layout optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript / JSX
- **Build Tool & Dev Server**: Vite 8
- **Routing**: React Router DOM v7
- **Charts & Data Visualization**: Recharts v3
- **Styling**: Vanilla CSS with modern CSS variables + Tailwind CSS

---

## 🚀 Getting Started

### Backend API

A Node.js/Express/MongoDB backend is available in [`backend/`](backend/README.md). Patient registration/login, profile, upload results, history, and comparisons are connected to it. Upload results are saved as clearly labeled synthetic demo readings; actual image colorimetry and AI-generated explanations are not implemented yet.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher recommended) installed.

### Installation

1. Navigate to the project directory:
   ```bash
   cd "Landing Page Design"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will be accessible at:
- **Local:** [http://localhost:5173/](http://localhost:5173/)
- **Network:** `http://<your-local-ip>:5173/`

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Structure

```text
Healthcare/
├── README.md
└── Landing Page Design/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── App.tsx                      # Main routing & layout configuration
        ├── main.tsx                     # React root mount
        ├── pages/
        │   ├── LandingPage.tsx          # Homepage & quick actions dashboard
        │   ├── UploadStrip.tsx          # Urinalysis strip upload & scanning
        │   ├── AIExplanation.jsx        # AI insights & biomarker explanations
        │   ├── History.tsx              # Patient test history & charts
        │   ├── Compare.jsx              # Test comparison view
        │   ├── PatientDetails.jsx       # Patient profile view
        │   ├── Login.jsx                # User login
        │   └── Signup.jsx               # User registration
        ├── components/
        │   ├── Sidebar.tsx              # Sliding navigation drawer
        │   ├── FormInput.jsx            # Reusable form field component
        │   ├── history/                 # History charts and summary widgets
        │   └── compare/                 # Compare widgets
        ├── services/
        │   ├── authService.js           # Authentication & patient session management
        │   ├── urineTestApi.js          # Urinalysis data API helpers
        │   └── historyUrineTestApi.js   # History data API helpers
        └── styles/
            ├── index.css                # Global styles
            ├── UploadStrip.css          # Upload strip styles
            ├── AIExplanation.css        # AI explanation styling
            └── History.css              # History & chart styles
```

---

## 📄 Available Routes

| Route | Page | Description |
|---|---|---|
| `/` or `/dashboard` | `LandingPage` | Home page & overview dashboard |
| `/upload-strip` | `UploadStrip` | Upload and analyze 10-parameter urine test strip |
| `/ai-explanation` | `AIExplanation` | AI clinical interpretation & biomarker guidance |
| `/history` | `History` | Interactive trend charts & historical test logs |
| `/compare` | `Compare` | Compare previous test results side-by-side |
| `/patient-details`| `PatientDetails`| View and edit patient information |
| `/login` | `Login` | Sign into patient account |
| `/signup` | `Signup` | Create new patient account |

---

## 🔒 Medical Disclaimer

*URINEX is intended for informational and screening assistance purposes only. It is not a substitute for professional medical diagnosis, treatment, or advice. Always consult a qualified healthcare provider for clinical evaluation.*
