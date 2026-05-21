# AI Usage

## Tools used and for what

- **Claude (claude-sonnet-4-6 via Claude Code)**: Used throughout the entire project — scaffolding both backend and frontend from scratch, generating NestJS modules, Prisma schema, Next.js pages, Tailwind components, unit tests, Docker Compose, GitHub Actions CI, and all documentation. Also used interactively to troubleshoot deploy errors on Render (missing `nest` CLI, JWT_SECRET not set, CORS misconfiguration).

## 2-3 key prompts that gave value

**1. Full architecture in one prompt**
> "Create a full-stack Task Manager with NestJS + Prisma + PostgreSQL backend and Next.js + Tailwind frontend. Backend needs JWT auth, CRUD tasks with pagination and status filter, class-validator for DTOs, Swagger docs. Frontend needs login/register pages, dashboard with filter/pagination, create/edit/delete task modals, TanStack Query for server state, Zod form validation. Each user only sees their own tasks."

Established the entire architecture and generated consistent, connected code across both layers in a single pass.

**2. Ownership isolation pattern**
> "In the TasksService, make findOne always throw ForbiddenException when the task belongs to another user, and reuse it as the guard for update and delete to avoid duplicate DB lookups."

This enforced the security rule in one place. Without this prompt the AI had generated separate authorization checks in each method — duplicated logic that's easy to forget to update.

**3. Fixing the Render deploy error**
> "The Render build fails with 'nest: not found'. The CLI is in devDependencies and Render runs npm install without dev deps. Fix the build command."

Diagnosed and resolved the production deploy blocker instantly: changing to `npm install --include=dev` before the build step.

## Something the AI did wrong and how I corrected it

The initial `jest.config.ts` used `setupFilesAfterFramework` — a key that does not exist in Jest's config spec. The correct key is `setupFilesAfterEnv`. This caused all frontend tests to silently skip the setup file (`@testing-library/jest-dom` matchers weren't loaded). Caught it by reading the Jest error output carefully and corrected it manually.

Also, the date assertion in `TaskCard.test.tsx` was hardcoded to `Dec 31, 2025`. The test environment runs in UTC, so `2025-12-31T00:00:00.000Z` rendered as `Dec 30, 2025` locally. Fixed by using a regex `/Dec \d+, 2025/` to be timezone-agnostic.

## Something I decided not to delegate to the AI

**The deploy configuration and environment variable strategy.** Deciding which variables are safe to commit (`.env.example` placeholders), which must never touch the repo (`DATABASE_URL`, `JWT_SECRET`), and how to wire them in Render and Vercel required understanding the full deployment topology. Delegating this to AI without that context risks generating instructions that accidentally expose secrets. I made those calls myself and only used the AI to execute once the strategy was clear.
