# Uso de IA

## Herramientas usadas y para qué

- **Claude (claude-sonnet-4-6 vía Claude Code)**: Usado a lo largo de todo el proyecto — scaffoldear backend y frontend desde cero, generar módulos NestJS, schema de Prisma, páginas Next.js, componentes Tailwind, tests unitarios, Docker Compose, CI con GitHub Actions y toda la documentación. También usado de forma interactiva para diagnosticar errores de despliegue en Render (CLI `nest` no encontrado, JWT_SECRET sin configurar, error de CORS).

## 2-3 prompts clave que dieron valor

**1. Arquitectura completa en un solo prompt**
> "Create a full-stack Task Manager with NestJS + Prisma + PostgreSQL backend and Next.js + Tailwind frontend. Backend needs JWT auth, CRUD tasks with pagination and status filter, class-validator for DTOs, Swagger docs. Frontend needs login/register pages, dashboard with filter/pagination, create/edit/delete task modals, TanStack Query for server state, Zod form validation. Each user only sees their own tasks."

Estableció la arquitectura completa y generó código consistente y conectado entre ambas capas en un solo paso.

**2. Patrón de aislamiento de ownership**
> "In the TasksService, make findOne always throw ForbiddenException when the task belongs to another user, and reuse it as the guard for update and delete to avoid duplicate DB lookups."

Centralizó la regla de seguridad en un solo lugar. Sin este prompt la IA había generado validaciones de autorización separadas en cada método — lógica duplicada que es fácil de olvidar actualizar.

**3. Diagnóstico del error de deploy en Render**
> "The Render build fails with 'nest: not found'. The CLI is in devDependencies and Render runs npm install without dev deps. Fix the build command."

Diagnosticó y resolvió el bloqueo de producción al instante: cambiar a `npm install --include=dev` antes del paso de build.

## Algo que la IA hizo mal y cómo lo corregí

El `jest.config.ts` inicial usaba `setupFilesAfterFramework` — una clave que no existe en la spec de configuración de Jest. La clave correcta es `setupFilesAfterEnv`. Esto hacía que todos los tests del frontend ignoraran silenciosamente el setup file (los matchers de `@testing-library/jest-dom` no se cargaban). Lo detecté leyendo el output de error de Jest con atención y lo corregí manualmente.

Además, el assertion de fecha en `TaskCard.test.tsx` estaba hardcodeado a `Dec 31, 2025`. El entorno de tests corre en UTC, entonces `2025-12-31T00:00:00.000Z` se renderizaba como `Dec 30, 2025` localmente. Lo corregí usando una regex `/Dec \d+, 2025/` para que sea agnóstico al timezone.

## Algo que decidí no delegar a la IA

**La configuración de despliegue y la estrategia de variables de entorno.** Decidir qué variables son seguras para commitear (placeholders en `.env.example`), cuáles nunca deben tocar el repo (`DATABASE_URL`, `JWT_SECRET`), y cómo conectarlas en Render y Vercel requería entender la topología completa del despliegue. Delegarlo a la IA sin ese contexto arriesga generar instrucciones que exponen secretos accidentalmente. Tomé esas decisiones yo mismo y solo usé la IA para ejecutar una vez que la estrategia estaba clara.
