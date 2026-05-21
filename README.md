# Task Manager

A full-stack task management app with JWT authentication. Each user can only see and manage their own tasks.

## Stack

| Layer     | Technology                                               |
|-----------|----------------------------------------------------------|
| Backend   | NestJS + TypeScript                                      |
| ORM       | Prisma                                                   |
| Database  | PostgreSQL                                               |
| Auth      | JWT (passport-jwt) + bcrypt                             |
| Validation| class-validator + class-transformer                      |
| Frontend  | Next.js 14 (App Router) + TypeScript                    |
| Styling   | Tailwind CSS                                             |
| State     | TanStack Query (server state) + React Context (auth)    |
| Forms     | React Hook Form + Zod                                    |
| Testing   | Jest + React Testing Library (frontend), Jest (backend) |

## Running locally

### Prerequisites
- Node.js 20+
- Docker (for PostgreSQL) or a PostgreSQL 15+ instance

### 1. Start the database

```bash
docker run --name task-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskmanager -p 5432:5432 -d postgres:16-alpine
```

Or use the full Docker Compose:

```bash
docker-compose up -d db
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

API available at: `http://localhost:4000/api`  
Swagger docs: `http://localhost:4000/api/docs`

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App available at: `http://localhost:3000`

### Full Docker Compose

```bash
# Build and start everything
docker-compose up --build

# Stop
docker-compose down
```

## Environment variables

### Backend (`backend/.env`)

| Variable       | Description                     | Default                                |
|----------------|---------------------------------|----------------------------------------|
| DATABASE_URL   | PostgreSQL connection string    | postgresql://postgres:postgres@localhost:5432/taskmanager |
| JWT_SECRET     | Secret key for signing JWTs     | —                                      |
| JWT_EXPIRES_IN | Token expiry                    | 7d                                     |
| PORT           | API server port                 | 4000                                   |
| FRONTEND_URL   | Allowed CORS origin             | http://localhost:3000                  |

### Frontend (`frontend/.env.local`)

| Variable              | Description      | Default                        |
|-----------------------|------------------|--------------------------------|
| NEXT_PUBLIC_API_URL   | Backend API URL  | http://localhost:4000/api      |

## API Endpoints

| Method | Path                | Auth | Description                              |
|--------|---------------------|------|------------------------------------------|
| POST   | /api/auth/register  | —    | Register (name, email, password)         |
| POST   | /api/auth/login     | —    | Login → returns JWT                      |
| GET    | /api/tasks          | JWT  | List tasks (filter: status, page, limit) |
| POST   | /api/tasks          | JWT  | Create task                              |
| GET    | /api/tasks/:id      | JWT  | Get task by ID                           |
| PUT    | /api/tasks/:id      | JWT  | Update task                              |
| DELETE | /api/tasks/:id      | JWT  | Delete task                              |

## Running tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Technical decisions

**NestJS over Express**: NestJS provides a structured architecture with built-in DI, modules, and decorators — reduces boilerplate for guards, validation pipes, and Swagger documentation. Better for a multi-endpoint API.

**Prisma over TypeORM/Drizzle**: Type-safe queries without the complexity of TypeORM decorators. Prisma's migration system is reliable and the generated client provides excellent autocomplete.

**TanStack Query over Redux/Zustand**: The tasks data is fundamentally server state. React Query handles caching, refetching, and loading/error states out of the box without extra boilerplate.

**Zod for frontend validation**: Consistent schema definition for forms and type inference — one schema generates both runtime validation and TypeScript types.

**JWT in localStorage**: Simpler implementation for this scope. In production, httpOnly cookies would be more secure against XSS.

## What I'd leave for next iteration

- Refresh token flow (short-lived access tokens + long-lived refresh)
- E2E tests with Playwright
- CI with GitHub Actions (lint + test + type-check)
- Task sorting options (by due date, creation date)
- User profile/settings page
- Email notifications for due dates
- Deploy: Railway (backend) + Vercel (frontend)
