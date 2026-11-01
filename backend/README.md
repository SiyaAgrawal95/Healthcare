# URINEX backend

Standalone Node.js, Express, and MongoDB REST API for patient profiles and colorimetric urine strip observations. It stores analysis output but does not itself upload or analyze images or make clinical decisions.

## Run locally

Requirements: Node.js 20+ and MongoDB (local or Atlas).

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Set a private, long random JWT_SECRET and your MongoDB URI in .env
npm run dev
```

The API listens on `http://localhost:5000`; `GET /api/health` checks service availability. Set `CLIENT_ORIGIN` to the frontend origin. Do not commit `.env` or use demo credentials for real patient data.

## API

JSON responses use `{ "error": "..." }` for failures. Patient and test routes require `Authorization: Bearer <token>` from registration/login. Patient access is restricted to the authenticated account.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create patient account; returns patient and token |
| POST | `/api/auth/login` | Authenticate; returns patient and token |
| GET | `/api/auth/me` | Current authenticated patient |
| GET | `/api/patients/me` | Read own patient profile |
| PATCH | `/api/patients/me` | Update own profile |
| DELETE | `/api/patients/me` | Deactivate own account |
| GET | `/api/patients/me/tests` | List own tests, newest first (`limit`, max 100) |
| POST | `/api/patients/:patientId/tests` | Create a test for own MongoDB patient ID |
| GET | `/api/patients/:patientId/tests` | Patient-specific paginated tests (`page`, `limit`, optional ISO `from`/`to`) |
| GET | `/api/tests/:testId` | Read a test |
| PATCH | `/api/tests/:testId` | Update test observations or analysis |
| DELETE | `/api/tests/:testId` | Delete a test |

Use the MongoDB `_id` as `patientId` in nested test routes; the human-facing `PAT-...` identifier is not the route key.

### Example test payload

```json
{
  "observedAt": "2026-10-19T08:30:00.000Z",
  "stripManufacturer": "Example",
  "stripLotNumber": "LOT-123",
  "source": "image",
  "image": { "storageKey": "private-object-key", "mimeType": "image/jpeg" },
  "device": { "deviceId": "reader-01", "calibrationId": "cal-2026-10" },
  "parameters": [
    {
      "name": "glucose",
      "value": "trace",
      "unit": "mg/dL",
      "interpretation": "trace",
      "status": "borderline",
      "confidence": 0.94,
      "color": {
        "colorHex": "#d9b274",
        "red": 217,
        "green": 178,
        "blue": 116,
        "intensity": 0.73,
        "lab": { "l": 74.2, "a": 4.1, "b": 31.7 },
        "referenceColor": "#d7b070",
        "deltaE": 2.8
      }
    }
  ],
  "analysis": {
    "status": "complete",
    "summary": "Example informational summary",
    "flags": ["glucose:trace"],
    "recommendations": ["Discuss persistent findings with a healthcare professional."],
    "confidence": 0.91,
    "modelName": "color-reader",
    "modelVersion": "1.0"
  }
}
```

Parameter names: `glucose`, `bilirubin`, `ketones`, `specificGravity`, `blood`, `ph`, `protein`, `urobilinogen`, `nitrite`, `leukocytes`. A test can store any subset, with no duplicate pad names. RGB channels use 0–255, normalized intensity and confidence use 0–1, and optional CIE L*a*b* readings are stored with the color sample. Keep original images in private object storage and save only a storage key in MongoDB; an upload/storage endpoint is not included yet.

Analysis is deliberately supplied by an external reader or AI service through the test create/update API. Stored explanations and recommendations are decision-support data, not a diagnosis. Validate any model output and keep human review for clinical use.

## Frontend integration

The frontend in `../Landing Page Design` now uses the API for registration, login, patient profile, history, and comparison. During local development, Vite proxies `/api` to `http://127.0.0.1:5000`; run the frontend with `npm run dev` and the API with `npm start` in this directory. The browser stores the bearer token and attaches it to protected requests.

For a deployed frontend, set `VITE_API_BASE_URL` to the deployed API base (for example, `https://api.example.com/api`) and configure the backend `CLIENT_ORIGIN` to the frontend origin. Strip image analysis and AI explanation are still demo-only in the frontend; the current upload screen does not save its simulated readings as patient test records.
