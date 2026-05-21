# AI Usage

## Tools used

- **Claude (claude-sonnet-4-6 via Claude Code)**: Primary tool for scaffolding the full project structure, generating NestJS modules, Prisma schema, Next.js pages, Tailwind components, tests, Docker config, and documentation.

## Key prompts that gave value

**1. Full project scaffold prompt**
> "Create a full-stack Task Manager with NestJS + Prisma + PostgreSQL backend and Next.js + Tailwind frontend. Backend needs JWT auth, CRUD tasks with pagination and status filter, class-validator for DTOs, Swagger docs. Frontend needs login/register pages, dashboard with filter/pagination, create/edit/delete task modals, TanStack Query for server state, Zod form validation. Each user only sees their own tasks."

This single prompt established the entire architecture and generated consistent code across both layers.

**2. Auth isolation pattern**
> "In the TasksService, make findOne always throw ForbiddenException (not NotFoundException) when the task exists but belongs to another user, and use this same method as the guard for update and delete to avoid duplicate DB lookups."

This enforced the security rule consistently and eliminated the N+1 pattern of re-fetching for authorization.

**3. NestJS JwtStrategy with Prisma validation**
> "Write a PassportStrategy that validates the JWT payload by fetching the user from Prisma and throws UnauthorizedException if the user no longer exists. Use ConfigService for the secret."

Gave a clean integration between the JWT library and the database layer.

## Something the AI got wrong and how I corrected it

The initial `jest.config.ts` had a typo: `setupFilesAfterFramework` instead of `setupFilesAfterFramework` — actually it used a non-existent key. The correct key is `setupFilesAfterFramework` → no, it's `setupFilesAfterEnv`. The AI used `setupFilesAfterFramework` which is invalid. Corrected to `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']`.

Also, the initial Prisma `TaskStatus` enum used `PENDING/DONE` but the AI generated the query filter DTO using string literals without importing the Prisma enum. Fixed by importing `TaskStatus` from `@prisma/client` in the DTO.

## Something I chose not to delegate to AI

**Database migration naming and seeding strategy.** I decided manually how to name the initial migration (`init`) and kept the seed file out of scope for this delivery. These decisions involve understanding the deployment environment (are we doing `migrate deploy` in CI or `migrate dev` locally?) and shouldn't be auto-generated without that context.

Also, the **security model** (JWT in localStorage vs. httpOnly cookies) — I explicitly chose localStorage for simplicity in this scope and noted the tradeoff in the README, rather than letting AI default to one or the other silently.
