# SWMS Dashboard Guidelines

## Project conventions

- This is the Next.js App Router dashboard for SWMS, separate from the Laravel backend and Flutter mobile app.
- Use TypeScript, React, Next.js App Router, and the dependencies already present in `package.json`. Do not add a package without a concrete need.
- Follow the clean, feature-oriented structure in [docs/architecture.md](docs/architecture.md).
- Put reusable, domain-neutral UI in `components/global/`. Keep components that only serve one feature/page under that feature's `components/` directory.
- Keep route files in `app/` thin. Place feature-specific presentation, use cases, domain types, and API access in `features/<feature>/`.
- Read [docs/design-system.md](docs/design-system.md) and `.agents/skills/dashboard-ui/SKILL.md` before dashboard UI work.
- Read [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) and `.agents/skills/admin-api-client/SKILL.md` before connecting a page to the backend.
- Keep user-facing copy in Indonesian and preserve responsive behavior and accessible labels/states.
- Never commit `.env.local`, credentials, passwords, bearer tokens, or real user data. `NEXT_PUBLIC_*` values are public configuration, not secrets.
- Keep admin access tokens only in the HttpOnly cookie managed by the Next.js BFF. Never persist them in `localStorage`, expose them to client components, or log them.
- Add/update tests for behavior when a test runner is introduced. Run `npm run lint` and `npm run build` when dependencies are available.
- Keep [docs/project_status.md](docs/project_status.md) and [docs/task.md](docs/task.md) aligned with completed work and verified outcomes.

## Skills

- Dashboard layout, components, and visual design: `.agents/skills/dashboard-ui/SKILL.md`
- Admin API, authentication boundary, and data fetching: `.agents/skills/admin-api-client/SKILL.md`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
