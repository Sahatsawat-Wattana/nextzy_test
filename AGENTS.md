# Repository Guidelines

## Project Structure & Module Organization

The product brief and reference screens remain at the repository root. The Next.js and Tailwind CSS client lives in `frontend/`; its pages are under `frontend/app/`, reusable UI under `frontend/components/`, and API helpers under `frontend/lib/`. The NestJS service lives in `backend/`, with application code in `backend/src/` and the PostgreSQL schema and migrations in `backend/prisma/`. Keep frontend tests beside their components or under `frontend/tests/`; keep backend tests alongside the relevant module.

## Build, Test, and Development Commands

No build system or package manifest has been committed yet. When scaffolding the project, expose a small, consistent command set from the repository root:

- `npm install` installs workspace dependencies.
- `npm run dev` starts the web and API development servers.
- `npm run build` produces production builds for both applications.
- `npm test` runs all automated tests.
- `npm run lint` checks formatting and static-analysis rules.

Document any additional database commands, such as `npm run db:migrate`, in the root `README.md`.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation in Next.js or NestJS code. Apply Prettier and ESLint before submitting changes. Name React components and exported types in PascalCase (`RewardProgress.tsx`), functions and variables in camelCase, and route folders in lowercase. If Go is selected for the API, use `gofmt`, idiomatic lowercase package names, and `_test.go` test files. Keep API payload types explicit and avoid duplicating checkpoint rules across layers.

## Testing Guidelines

Cover score accumulation, the 10,000-point cap, reward checkpoints at 5,000/7,500/10,000, one-time claims, reset behavior, and play/reward history. Add component tests for progress and modal states and API integration tests for persistence and validation. Name TypeScript tests `*.test.ts(x)` or `*.spec.ts`; run `npm test` before opening a pull request.

## Commit & Pull Request Guidelines

There is no Git history from which to infer an existing convention. Use concise, imperative Conventional Commits, for example `feat: add reward claim endpoint`. Pull requests should explain the behavior change, list verification commands, link the relevant issue, and include screenshots for Home, Game, or responsive UI changes. Call out schema migrations, configuration changes, and API contract updates explicitly.

## Security & Configuration

Keep secrets and PostgreSQL credentials in ignored `.env` files. Commit a sanitized `.env.example`, validate all API input, and never trust client-supplied score or reward state.
