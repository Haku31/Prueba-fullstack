# Task Manager — Prueba Técnica Full Stack

App de gestión de tareas con autenticación JWT. Cada usuario solo ve y modifica sus propias tareas.

**Demo en vivo:**
- Frontend: https://prueba-fullstack-lyart.vercel.app
- API: https://prueba-fullstack-11f9.onrender.com/api
- Swagger: https://prueba-fullstack-11f9.onrender.com/api/docs

---

## Stack

| Capa         | Tecnología                                                   |
|--------------|--------------------------------------------------------------|
| Backend      | NestJS + TypeScript                                          |
| Base de datos| PostgreSQL (Neon — serverless)                               |
| ORM          | Prisma                                                       |
| Auth         | JWT via `@nestjs/jwt` + `passport-jwt`                       |
| Contraseñas  | bcrypt                                                       |
| Validación   | class-validator + class-transformer                          |
| Docs API     | Swagger via `@nestjs/swagger`                                |
| Frontend     | Next.js 14 (App Router) + TypeScript                         |
| Estilos      | Tailwind CSS                                                 |
| Estado servidor | TanStack Query v5                                         |
| Formularios  | React Hook Form + Zod                                        |
| HTTP client  | Axios con interceptores de request/response                  |
| Tests        | Jest + React Testing Library (frontend), Jest (backend)      |
| CI           | GitHub Actions                                               |

---

## Cómo correr el proyecto

### Requisitos previos
- Node.js 20+
- Docker (para PostgreSQL local) o cuenta en Neon/Supabase

### 1. Clonar el repo

```bash
git clone https://github.com/Haku31/Prueba-fullstack.git
cd Prueba-fullstack
```

### 2. Iniciar la base de datos (Docker)

```bash
docker run --name task-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskmanager \
  -p 5432:5432 -d postgres:16-alpine
```

O usar Docker Compose para todo el stack:

```bash
docker-compose up --build
```

### 3. Backend

```bash
cd backend
cp .env.example .env      # completar con tus valores
npm install
npx prisma migrate dev --name init
npm run start:dev
```

- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`

### 4. Frontend

```bash
cd frontend
cp .env.example .env.local   # completar con tus valores
npm install
npm run dev
```

- App: `http://localhost:3000`

---

## Variables de entorno

### Backend — `backend/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
JWT_SECRET="tu-clave-secreta"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Ver `backend/.env.example` para el template completo.

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Ver `frontend/.env.example` para el template completo.

---

## Endpoints de la API

Todos los endpoints de tareas requieren `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Registro (name, email, password) |
| POST | `/api/auth/login` | — | Login → devuelve JWT |
| GET | `/api/tasks` | JWT | Listar tareas — `?status=PENDING\|DONE&page=1&limit=10` |
| POST | `/api/tasks` | JWT | Crear tarea (title, description, status, dueDate) |
| GET | `/api/tasks/:id` | JWT | Obtener tarea por ID |
| PUT | `/api/tasks/:id` | JWT | Actualizar tarea |
| DELETE | `/api/tasks/:id` | JWT | Eliminar tarea |

Un usuario que intente acceder a la tarea de otro recibe `403 Forbidden`.

---

## Correr los tests

```bash
# Backend — 12 tests unitarios
cd backend && npm test

# Frontend — 13 tests unitarios
cd frontend && npm test
```

---

## Decisiones técnicas

**NestJS sobre Express** — NestJS provee arquitectura estructurada con DI, decoradores y módulos. Reduce el boilerplate para guards JWT, validation pipes y Swagger. Para una API con múltiples endpoints se justifica desde el primer endpoint.

**Prisma sobre TypeORM / Drizzle** — Queries type-safe sin el ruido de los decoradores. El sistema de migraciones es confiable y el cliente generado tiene autocompletado completo. Fácil de leer y auditar.

**TanStack Query sobre Redux / Zustand** — Los datos de tareas son estado del servidor, no estado del cliente. React Query maneja caché, refetch en background y estados de loading/error sin boilerplate extra.

**React Hook Form + Zod** — Un schema Zod genera tanto el tipo TypeScript como la validación en runtime. Sin duplicación entre la capa de formulario y la capa de tipos.

**JWT en localStorage** — Más simple para este alcance. En producción las cookies httpOnly protegen contra XSS. Tradeoff documentado, decisión consciente.

**Control de ownership en `findOne` compartido** — `TasksService.findOne` siempre valida el userId. `update` y `delete` lo llaman primero, así la lógica de control de acceso vive en un solo lugar y nunca se omite.

---

## Qué dejaría pendiente

- Flujo de refresh token (access de vida corta + refresh de vida larga)
- Tests e2e con Playwright
- Ordenamiento de tareas (por fecha de vencimiento, de creación)
- Página de perfil / configuración de usuario
- Recordatorios por email para fechas de vencimiento
- Auth con cookies httpOnly para producción hardening

---

## Bonus completados

- [x] Docker Compose (stack completo)
- [x] Deploy — Vercel (frontend) + Render (backend) + Neon (base de datos)
- [x] Swagger docs
- [x] CI con GitHub Actions (type-check + tests + build en cada push)
