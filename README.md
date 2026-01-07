# MERN Starter — "new"

This repository is a minimal MERN starter scaffold with sensible defaults for rapid prototyping.

Structure

- `backend/` — Express + Mongoose API
- `frontend/` — Vite + React app

Quick start (local)

1. Start MongoDB (e.g., `mongod` or use Docker). The default connection string is `mongodb://localhost:27017/new_dev`.
2. Seed the DB and start backend:

```bash
cd backend
npm install
# create .env with MONGO_URI (or use default localhost)
npm run seed
npm run dev
```

3. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Open http://localhost:5173 (frontend) — it will call the backend at http://localhost:5000/api

Deploy

- CI: GitHub Actions builds both apps.
- Hosting suggestion: Render / DigitalOcean / Heroku for fullstack apps; Vercel for frontend.

Notes

- Backend now includes JWT authentication and basic Smart Lab features (assignments, submissions, plagiarism).
- Backend tests: `cd backend && npm test` uses `mongodb-memory-server` for isolated tests.
- Feel free to ask me to add TypeScript, Docker, auth improvements, or additional features.
