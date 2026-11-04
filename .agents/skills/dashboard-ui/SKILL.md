---
name: dashboard-ui
description: "Use when creating or changing SWMS dashboard pages, layouts, shared components, responsive behavior, or visual styling."
---

# SWMS Dashboard UI

Use this workflow for dashboard visual work:

1. Read `docs/design-system.md` and `docs/architecture.md`.
2. Confirm whether the component is domain-neutral and used across multiple features. If so, place it in `src/components/global/`; otherwise keep it inside its owning feature.
3. Keep App Router page files focused on route composition; put feature-specific UI in `src/features/<feature>/components/`.
4. Preserve the former Blade dashboard's forest-green navigation, soft green canvas, pastel status/stat cards, recent-reports table, and next-actions panel unless the user asks for a redesign.
5. Build responsive navigation and layouts; avoid hiding important actions on small screens.
6. Include accessible names, keyboard focus states, loading, empty, and error states. Do not invent report values or imply successful actions before the API confirms them.
7. Prefer existing Tailwind/CSS and installed dependencies. Do not add UI packages or charting packages without a demonstrated requirement.
8. When dependencies are ready, run the focused checks plus `npm run lint` and `npm run build`.
