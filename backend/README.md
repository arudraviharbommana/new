# Backend (Express + Mongoose) — Smart Lab Backend (MERN-molded)

This backend is a translated implementation of the provided Python FastAPI spec into Node.js + Express + Mongoose.

Key features:
- JWT authentication with roles (student, professor, admin)
- Assignment and submission workflows
- Relatability analysis service (TF-IDF + heuristics) — compares a submission to the assignment description and computes metrics such as content similarity, variable name similarity, comment style similarity, structure heuristics and potential external matches. This intentionally does NOT flag inter-student plagiarism (submissions are not compared to each other by default).
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
- GET `/api/professor/plagiarism/:submission_id` (Bearer token role=professor) — returns a detailed `report` object describing relatability metrics
- POST `/api/professor/mark/:submission_id` (Bearer token role=professor) — submit `professor_mark` and `professor_comment` to set a direct mark for the submission

Admin
- GET `/api/admin/users` (Bearer token role=admin)
- DELETE `/api/admin/users/:id` (Bearer token role=admin)

Notes
- The plagiarism endpoint stores the computed score in the submission record.
- Tests included: basic health and auth tests using mongodb-memory-server.
