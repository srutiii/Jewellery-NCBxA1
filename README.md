## Jewellery-NCBxA1 — Monorepo Setup Guide

This repo contains three apps:

- `frontend/` — React + TypeScript app (Vite + Tailwind + shadcn/ui)
- `frontend/api/` — Node.js/Express REST API (supports JSON file or Firebase Firestore persistence)
- `admin/` — React + TypeScript admin dashboard (Vite + Tailwind)

Follow this guide to install, configure, and run everything locally on Windows/macOS/Linux.

### Prerequisites

- Node.js 18+ and npm 9+ (recommended)
- Git

### Quick Start

1) Clone the repo

```bash
git clone https://github.com/<your-org-or-user>/Jewellery-NCBxA1.git
cd Jewellery-NCBxA1
```

2) Install dependencies (apps are independent)

```bash
# Frontend
cd frontend && npm install

# Backend API
cd ../frontend/api && npm install

# Admin dashboard (optional)
cd ../../admin && npm install
```

3) Run the services (use separate terminals)

```bash
# Terminal A – Backend API (http://localhost:3000)
cd frontend/api
npm run dev

# Terminal B – Frontend (http://localhost:5173)
cd frontend
npm run dev

# Terminal C – Admin (http://localhost:5173 or next available port)
cd admin
npm run dev
```

If port 5173 is in use, Vite will prompt to use another port.

---

### Backend API

Location: `frontend/api/`

- Dev server: `npm run dev` (nodemon)
- Prod: `npm start`
- Default port: `3000`
- Base URL: `http://localhost:3000`
- Swagger JSON: `GET /api-docs`

Routes:

- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`
- `GET /customers/email/check/:email`

Persistence options:

- File-based (JSON): `frontend/api/data/customers.json` (classic model)
- Firestore (recommended): via Firebase Admin SDK (see Firebase setup)

---

### Frontend App

Location: `frontend/`

- Dev server: `npm run dev`
- Default port: `5173`
- Talks to API at `http://localhost:3000` (see `src/services/api.ts`)

Key file:

- `src/services/api.ts` — client for the API base URL and endpoints

---

### Admin Dashboard

Location: `admin/`

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

---

### Firebase Setup (Frontend + Backend)

You can run the system fully with local JSON storage, but using Firebase enables cloud storage in Firestore and richer features.

1) Create a Firebase project or use an existing one.

2) Frontend credentials (public config)

- File: `frontend/src/config/firebase.ts`
- Replace the hardcoded `firebaseConfig` with your project’s values or move them to environment variables via Vite if desired. The current project uses:
  - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`

3) Backend service account (secure, server-side)

- Files:
  - `frontend/api/src/config/firebase-config.js` (holds service account details or reads env vars)
  - `frontend/api/src/config/firebase-admin.js` (initializes Admin SDK)

Recommended: keep secrets in environment variables and do NOT hardcode keys.

Create `frontend/api/.env` with:

```bash
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

Then set `useEnvVars: true` in `frontend/api/src/config/firebase-config.js` to read from the `.env` file.

4) Switch persistence mode

- The controllers use `firebaseCustomer` model by default. Ensure Firebase Admin initializes cleanly. If you prefer JSON storage for local testing, you can wire the controllers to the classic file-backed `models/customer.js` instead of `models/firebaseCustomer.js`.

5) Firestore security rules (development example)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{document} {
      allow read, write: if true; // Development only. Lock down for production.
    }
  }
}
```

---

### Windows Notes

- Use PowerShell or cmd. All scripts are npm-based and non-interactive.
- If you see “port in use” errors, either stop the conflicting process or allow Vite to switch ports.
- If the backend can’t initialize Firebase Admin, double‑check `.env` quoting for multiline private keys (must include `\n`).

---

### Common Issues

- CORS errors: ensure the backend is running on `http://localhost:3000` and accessible. The API enables CORS by default.
- Validation errors: backend validates required fields; see Swagger (`/api-docs`).
- Email uniqueness: backend checks duplicates on `create`/`update`.
- File permissions: if using JSON persistence, ensure `frontend/api/data/` is writable.

---

### Scripts Reference

Frontend (`frontend/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build

Backend API (`frontend/api/package.json`):

- `npm run dev` — start express with nodemon on 3000
- `npm start` — start express
- `npm test` — run sample tests (`test.js`)

Admin (`admin/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build

---

### Folder Map

```
admin/                 # Admin dashboard (React + Vite)
frontend/              # Main frontend app (React + Vite)
  src/services/api.ts  # API client (points to http://localhost:3000)
  src/config/firebase.ts# Frontend Firebase config (public)
frontend/api/          # Backend API (Express)
  src/config/firebase-config.js  # Admin SDK config (env or hardcoded)
  src/config/firebase-admin.js   # Admin SDK init
  src/controllers/               # API logic
  src/models/                    # Firestore or file-backed models
  src/routes/                    # Express routes
  data/customers.json            # File storage (if used)
```

---

### Production Notes

- Never commit service account keys. Use env vars or a secrets manager.
- Configure allowed origins for CORS in production.
- Serve the frontend behind a reverse proxy and point it to your deployed API URL.

---

### License

MIT (or your preferred license).


