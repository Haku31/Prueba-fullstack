# Uso de IA

## Herramientas usadas

- **Claude (claude-sonnet-4-6 vía Claude Code)**: Herramienta principal para scaffoldear la estructura completa del proyecto, generar módulos NestJS, schema de Prisma, páginas Next.js, componentes Tailwind, tests, configuración Docker y documentación.

## Prompts clave que dieron valor

**1. Scaffold completo del proyecto**
> "Create a full-stack Task Manager with NestJS + Prisma + PostgreSQL backend and Next.js + Tailwind frontend. Backend needs JWT auth, CRUD tasks with pagination and status filter, class-validator for DTOs, Swagger docs. Frontend needs login/register pages, dashboard with filter/pagination, create/edit/delete task modals, TanStack Query for server state, Zod form validation. Each user only sees their own tasks."

Este prompt único estableció la arquitectura completa y generó código consistente entre ambas capas.

**2. Patrón de aislamiento de autenticación**
> "In the TasksService, make findOne always throw ForbiddenException (not NotFoundException) when the task exists but belongs to another user, and use this same method as the guard for update and delete to avoid duplicate DB lookups."

Esto reforzó la regla de seguridad de forma consistente y eliminó el patrón N+1 de re-consulta para autorización.

**3. JwtStrategy de NestJS con validación en Prisma**
> "Write a PassportStrategy that validates the JWT payload by fetching the user from Prisma and throws UnauthorizedException if the user no longer exists. Use ConfigService for the secret."

Dio una integración limpia entre la librería JWT y la capa de base de datos.

## Algo que la IA hizo mal y cómo lo corregí

El `jest.config.ts` inicial tenía un typo: usaba `setupFilesAfterFramework` que no es una clave válida de Jest. La clave correcta es `setupFilesAfterEnv`. Lo corregí manualmente.

Además, la IA generó el DTO de filtro de tareas usando literales de string en lugar de importar el enum `TaskStatus` de `@prisma/client`. Corregido importando el tipo directamente.

## Algo que decidí no delegar a la IA

**La estrategia de migraciones y seeds.** Decidí manualmente cómo nombrar la migración inicial (`init`) y dejé el seed fuera del alcance de esta entrega. Estas decisiones implican entender el entorno de despliegue (¿se usa `migrate deploy` en CI o `migrate dev` en local?) y no deben auto-generarse sin ese contexto.

También la **decisión de seguridad** sobre JWT en localStorage vs. cookies httpOnly — elegí localStorage por simplicidad en este alcance y documenté el tradeoff en el README, en lugar de dejar que la IA eligiera uno sin ese razonamiento explícito.
