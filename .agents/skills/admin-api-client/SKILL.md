---
name: admin-api-client
description: "Use when connecting SWMS dashboard features to the Laravel Admin API, including login, report management, user management, and API error handling."
---

# SWMS Admin API Client

Use this workflow before implementing dashboard data access:

1. Read `docs/API_DOCUMENTATION.md` and verify current request/response details in the backend's `docs/API_DOCUMENTATION.md`.
2. Keep HTTP transport and API DTO mapping in the feature's `infrastructure/` layer. Expose domain-oriented operations to application/use-case code; UI components should not construct URLs or parse raw API responses.
3. Use server-only `SWMS_API_BASE_URL` as the Laravel API origin/prefix. It is not a credential.
4. Admin API calls require a bearer token from the admin login flow. Never put tokens, passwords, or Cloudflare credentials in environment variables, source files, logs, or `NEXT_PUBLIC_*` settings.
5. Keep bearer tokens only in the Next.js BFF's HttpOnly cookie. Do not return or forward the token to client JavaScript, and do not persist it in `localStorage`.
6. Send `Accept: application/json`, handle `401`, `403`, `422`, network failures, empty results, and pagination explicitly, and only show success after a successful response.
7. User-facing admin actions must match backend authorization and workflow. Status changes are available only through the Admin API status endpoint.
8. Add tests for DTO mapping, error handling, and use cases when a test runner is available. Never use live production credentials or data in tests.
