# Backend (Express + Mongoose) — Smart Lab Backend (MERN-molded)

This backend is a translated implementation of the provided Python FastAPI spec into Node.js + Express + Mongoose.

Key features:
- JWT authentication with roles (student, professor, admin)
- Assignment and submission workflows
- Plagiarism service (TF-IDF + cosine similarity)
- File uploads via multipart/form-data (stored in `uploads/`)
- Seed script to create sample users, assignments, and submissions

Environment variables (create a `.env` at project root or in `backend/`):

```
MONGO_URI=mongodb://localhost:27017/new_dev
PORT=5000
SECRET_KEY=change-me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run locally:

```bash
cd backend
npm install
# optionally create a .env — a secure one is already generated locally at `backend/.env`
npm run seed
npm run dev
```

API endpoints:

Auth
- POST `/api/auth/register` {name,email,password,role}
- POST `/api/auth/login` {email,password}
- GET `/api/auth/me` (Bearer token)

Student
- GET `/api/student/assignments` (Bearer token role=student)
- POST `/api/student/submit` (form-data: assignment_id, content, file) (Bearer token role=student)
- GET `/api/student/submissions` (Bearer token role=student)

Professor
- POST `/api/professor/assignment` (title,description,deadline) (Bearer token role=professor)
- GET `/api/professor/submissions` (Bearer token role=professor)
- GET `/api/professor/plagiarism/:submission_id` (Bearer token role=professor)

Admin
- GET `/api/admin/users` (Bearer token role=admin)
- DELETE `/api/admin/users/:id` (Bearer token role=admin)

Notes
- The plagiarism endpoint stores the computed score in the submission record.
- Tests included: basic health and auth tests using mongodb-memory-server.
