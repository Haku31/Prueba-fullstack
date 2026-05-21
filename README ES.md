# Task Manager

App full-stack de gestión de tareas con autenticación JWT. Cada usuario solo ve y gestiona sus propias tareas.

## Stack

| Capa       | Tecnología                                                    |
|------------|---------------------------------------------------------------|
| Backend    | NestJS + TypeScript                                           |
| ORM        | Prisma                                                        |
| Base datos | PostgreSQL                                                    |
| Auth       | JWT (passport-jwt) + bcrypt                                  |
| Validación | class-validator + class-transformer                           |
| Frontend   | Next.js 14 (App Router) + TypeScript                         |
| Estilos    | Tailwind CSS                                                  |
| Estado     | TanStack Query (estado servidor) + React Context (auth)      |
| Formularios| React Hook Form + Zod                                        |
| Tests      | Jest + React Testing Library (frontend), Jest (backend)      |

## Correr el proyecto localmente

### Requisitos previos
- Node.js 20+
- Docker (para PostgreSQL) o una instancia PostgreSQL 15+

### 1. Iniciar la base de datos

```bash
docker run --name task-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskmanager -p 5432:5432 -d postgres:16-alpine
```

O usar el Docker Compose completo:

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

API disponible en: `http://localhost:4000/api`
Docs Swagger: `http://localhost:4000/api/docs`

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App disponible en: `http://localhost:3000`

### Docker Compose completo

```bash
# Construir y levantar todo
docker-compose up --build

# Detener
docker-compose down
```

## Variables de entorno

### Backend (`backend/.env`)

| Variable       | Descripción                          | Default                                                     |
|----------------|--------------------------------------|-------------------------------------------------------------|
| DATABASE_URL   | Cadena de conexión PostgreSQL        | postgresql://postgres:postgres@localhost:5432/taskmanager   |
| JWT_SECRET     | Clave secreta para firmar los JWT    | —                                                           |
| JWT_EXPIRES_IN | Expiración del token                 | 7d                                                          |
| PORT           | Puerto del servidor API              | 4000                                                        |
| FRONTEND_URL   | Origen CORS permitido                | http://localhost:3000                                       |

### Frontend (`frontend/.env.local`)

| Variable              | Descripción       | Default                       |
|-----------------------|-------------------|-------------------------------|
| NEXT_PUBLIC_API_URL   | URL del API       | http://localhost:4000/api     |

## Endpoints de la API

| Método | Ruta                | Auth | Descripción                                  |
|--------|---------------------|------|----------------------------------------------|
| POST   | /api/auth/register  | —    | Registro (name, email, password)             |
| POST   | /api/auth/login     | —    | Login → devuelve JWT                         |
| GET    | /api/tasks          | JWT  | Lista tareas (filtro: status, page, limit)   |
| POST   | /api/tasks          | JWT  | Crear tarea                                  |
| GET    | /api/tasks/:id      | JWT  | Obtener tarea por ID                         |
| PUT    | /api/tasks/:id      | JWT  | Actualizar tarea                             |
| DELETE | /api/tasks/:id      | JWT  | Eliminar tarea                               |

## Correr los tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Decisiones técnicas

**NestJS en lugar de Express**: NestJS provee arquitectura estructurada con inyección de dependencias, módulos y decoradores — reduce el boilerplate para guards, pipes de validación y documentación Swagger.

**Prisma en lugar de TypeORM/Drizzle**: Queries type-safe sin la complejidad de los decoradores de TypeORM. El sistema de migraciones de Prisma es confiable y el cliente generado ofrece excelente autocompletado.

**TanStack Query en lugar de Redux/Zustand**: Los datos de tareas son fundamentalmente estado del servidor. React Query maneja caché, refetch y estados de loading/error sin boilerplate adicional.

**Zod para validación en frontend**: Definición de esquemas consistente para formularios e inferencia de tipos — un schema genera tanto validación en runtime como tipos TypeScript.

**JWT en localStorage**: Implementación más simple para este alcance. En producción, cookies httpOnly serían más seguras contra XSS.

## Qué dejaría pendiente

- Flujo de refresh token (access tokens de vida corta + refresh tokens de larga vida)
- Tests e2e con Playwright
- CI con GitHub Actions (lint + test + type-check)
- Opciones de ordenamiento de tareas (por fecha de vencimiento, fecha de creación)
- Página de perfil/configuración de usuario
- Notificaciones por email para fechas de vencimiento
- Deploy: Railway (backend) + Vercel (frontend)
