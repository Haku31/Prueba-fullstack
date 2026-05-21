# Task Manager — Full Stack Technical Test

A task management app with JWT authentication. Each user can only see and manage their own tasks.

**Live demo:**
- Frontend: https://prueba-fullstack-lyart.vercel.app
- API: https://prueba-fullstack-11f9.onrender.com/api
- Swagger: https://prueba-fullstack-11f9.onrender.com/api/docs

---

## Stack

| Layer      | Technology                                                   |
|------------|--------------------------------------------------------------|
| Backend    | NestJS + TypeScript                                          |
| Database   | PostgreSQL (Neon — serverless)                               |
| ORM        | Prisma                                                       |
| Auth       | JWT via `@nestjs/jwt` + `passport-jwt`                       |
| Passwords  | bcrypt                                                       |
| Validation | class-validator + class-transformer                          |
| API Docs   | Swagger via `@nestjs/swagger`                                |
| Frontend   | Next.js 14 (App Router) + TypeScript                         |
| Styling    | Tailwind CSS                                                 |
| Server state | TanStack Query v5                                          |
| Forms      | React Hook Form + Zod                                        |
| HTTP client | Axios with request/response interceptors                    |
| Testing    | Jest + React Testing Library (frontend), Jest (backend)      |
| CI         | GitHub Actions                                               |

---

## How to run the project

### Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL) or a Neon/Supabase account

### 1. Clone the repo

```bash
git clone https://github.com/Haku31/Prueba-fullstack.git
cd Prueba-fullstack
```

### 2. Start the database (Docker)

```bash
docker run --name task-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskmanager \
  -p 5432:5432 -d postgres:16-alpine
```

Or use Docker Compose for the full stack:

```bash
docker-compose up --build
```

### 3. Backend

```bash
cd backend
cp .env.example .env      # fill in your values
npm install
npx prisma migrate dev --name init
npm run start:dev
```

- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`

### 4. Frontend

```bash
cd frontend
cp .env.example .env.local   # fill in your values
npm install
npm run dev
```

- App: `http://localhost:3000`

---

## Environment variables

### Backend — `backend/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

See `backend/.env.example` for the full template.

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

See `frontend/.env.example` for the full template.

---

## API Endpoints

All task endpoints require `Authorization: Bearer <token>`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register (name, email, password) |
| POST | `/api/auth/login` | — | Login → returns JWT |
| GET | `/api/tasks` | JWT | List tasks — `?status=PENDING\|DONE&page=1&limit=10` |
| POST | `/api/tasks` | JWT | Create task (title, description, status, dueDate) |
| GET | `/api/tasks/:id` | JWT | Get task by ID |
| PUT | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |

A user attempting to access another user's task receives `403 Forbidden`.

---

## Running tests

```bash
# Backend — 12 unit tests
cd backend && npm test

# Frontend — 13 unit tests
cd frontend && npm test
```

---

## Technical decisions

**NestJS over Express** — NestJS provides a structured architecture with built-in DI, decorators, and modules. This reduces boilerplate for JWT guards, validation pipes, and Swagger. For a multi-endpoint API it pays off immediately.

**Prisma over TypeORM / Drizzle** — Type-safe queries without decorator noise. The migration system is reliable and the generated client provides full autocomplete. Easy to read and audit.

**TanStack Query over Redux / Zustand** — Task data is server state, not client state. React Query handles caching, background refetch, and loading/error states without extra boilerplate.

**React Hook Form + Zod** — One Zod schema generates both the TypeScript type and the runtime validation. No duplication between form and type layer.

**JWT stored in localStorage** — Simpler for this scope. In production httpOnly cookies would protect against XSS. Documented tradeoff, conscious choice.

**Ownership check via shared `findOne`** — `TasksService.findOne` always validates userId. `update` and `delete` call it first, so the access control logic lives in one place and is never skipped.

---

## What I'd leave for next iteration

- Refresh token flow (short-lived access + long-lived refresh)
- E2E tests with Playwright
- Task sorting (by due date, creation date)
- User profile / settings page
- Email reminders for due dates
- httpOnly cookie auth for production hardening

---

## Bonus completed

- [x] Docker Compose (full stack)
- [x] Deploy — Vercel (frontend) + Render (backend) + Neon (database)
- [x] Swagger docs
- [x] CI with GitHub Actions (type-check + tests + build on every push)
