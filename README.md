# Web3 Message Signer & Verifier

A full-stack Web3 application that lets users authenticate with **Dynamic.xyz Headless Embedded Wallet**, sign custom messages, and verify signatures server-side using `ethers.js`.

##  Features

- Headless Authentication** — Login without the Dynamic widget, wallet is embedded silently
- Custom Message Signing** — Sign any message you type
- Signature Submission** — Send `{ message, signature }` to backend
- Server-side Verification** — Backend recovers signer address and checks authenticity
- Local History** — View previously signed messages with verification results
- Multi-message Support** — Sign multiple messages without logging out
- Security Warnings** — Warns users before signing arbitrary content
- No Database** — Session is in memory, history stored in `localStorage`

---

##  Tech Stack

### Frontend
- React 18+ (TypeScript)
- Tailwind CSS
- Dynamic.xyz Headless Embedded Wallet SDK
- Axios for API calls
- LocalStorage for history

### Backend
- Node.js 18+ (TypeScript)
- Express.js
- Ethers.js for signature recovery
- Zod for input validation
- Helmet, CORS, and rate limiting for security

---

##  Prerequisites
- Node.js 18+
- npm 
- Dynamic.xyz account with environment ID & API key

---

##  Quick Start

### 1. Clone & Install
```bash
# Root install
npm install

# Install all workspaces
npm run install:all
```

### 2. Environment Setup

**Backend (.env)**
```bash
cd backend
cp env.example .env
```
Update:
```env
PORT=3001
NODE_ENV=development
DYNAMIC_ENVIRONMENT_ID=environment_id_here
DYNAMIC_API_KEY=your_dynamic_api_key_here
```
**And change the environment key in main.tsx**


**Frontend (.env)**
```bash
cd frontend
The `VITE_DYNAMIC_ENVIRONMENT_ID` is already set.

---

### 3. Run Development
```bash
# Start frontend & backend
npm run dev

# Or separately:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

---

##  Usage Flow

1. **Authenticate**
   - Enter your email
   - Complete OTP

2. **Sign Message**
   - Type a message
   - Click "Sign Message"
   - Sign request is processed by embedded wallet
   - Signature sent to backend automatically

3. **Verify Signature**
   - Backend uses `ethers.verifyMessage` to recover the signer address
   - Result shown in frontend (success/failure)
   - Saved to history

4. **History**
   - Previous signed messages listed with verification results
   - Stored in `localStorage`

---

## Structure
```
backend/       # Express backend
frontend/      # React frontend

---

##  Common Issues

1. **ERR_CONNECTION_REFUSED**
   - Backend not running or wrong port

2. **Signature Mismatch**
   - Message altered before verification

3. **Dynamic Auth Fails**
   - Check environment ID & API key in `.env`

---

##  Note
The environment ID `3ac1cd18-8219-4494-9192-f49614e0ac70` links this app to your Dynamic project. Changing it will connect to a different Dynamic setup.
