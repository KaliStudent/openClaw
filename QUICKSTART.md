# Quick Start Guide

## Running MainStreet AI Locally

You need **two terminals** — one for the backend API, one for the frontend website.

---

### Terminal 1: Backend API (port 3001)

```bash
cd platform/backend
npm install
npm run dev
```

You should see:
```
info: Server running on port 3001
info: Dev admin seeded: admin@platform.local / admin123
```

**Test it works:** Open http://localhost:3001/api/health in your browser. You should see:
```json
{"status":"ok","timestamp":"..."}
```

---

### Terminal 2: Frontend Website (port 3000)

```bash
cd platform/frontend
npm install
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

**Open it:** Go to http://localhost:3000 in your browser. You'll see the MainStreet AI landing page.

---

### Test Flow

1. Go to http://localhost:3000
2. Click "Get Started" → Register with any email/password
3. You'll be taken to the Dashboard
4. Click "Create Agent" → Fill in business details → Create
5. You now have an agent!

### Admin Access

1. Go to http://localhost:3000/login
2. Click "Admin access" at the bottom
3. Login with: `admin@platform.local` / `admin123`
4. You'll see the admin panel with agent builder, skills, etc.

---

### API Testing (optional)

With the backend running, you can test the API directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User","business_name":"Test Biz"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

### Notes

- Backend is in-memory only right now (no database). Data resets on restart.
- Chat responses return a placeholder until an LLM API key is configured.
- The TTS service is a separate component that requires a GPU (see `tts-service/README.md`).
- Frontend talks to backend on port 3001. If you change the backend port, update `NEXT_PUBLIC_API_URL` in the frontend.
