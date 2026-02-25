# Project: CNC E-Commerce Platform (industrialWebsite)

## Tech Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS v4
- Prisma 5 + PostgreSQL (Neon Cloud), NextAuth v5 beta
- Material Symbols Outlined (via Google CDN link in head)

## Architecture
- Route groups: `(storefront)` has UtilityBar+Header+Footer via StorefrontShell
- `/admin` has its own layout (sidebar + top bar) — auth pages skip sidebar via pathname check
- `[...slug]` catch-all in storefront for SEO slugs, dosya-merkezi, bundles, blog categories
- Server actions in `src/lib/actions/` for mutations
- API routes for search autocomplete and cart

## Auth Architecture (Finalized)
- NextAuth v5 beta (Credentials provider, JWT session strategy)
- `src/lib/auth.ts` — NextAuth config; role + id in JWT/session
- `src/types/next-auth.d.ts` — extends Session and JWT types
- `src/middleware.ts` — protects /admin/* (redirect → /admin/login), /hesap/*, /favoriler/*
  - Admin auth pages (login/forgot-password/reset-password) are EXCLUDED from protection
  - Authenticated admins hitting auth pages get redirected to /admin
- Admin layout (`src/app/admin/layout.tsx`) checks pathname and renders children-only for auth pages
- Admin logout redirects to `/admin/login`

## Admin Auth Pages
- `/admin/login` — dedicated admin console login (dark theme, separate from storefront login)
- `/admin/forgot-password` — request reset link (rate-limited, always shows success)
- `/admin/reset-password?token=` — set new password (validates token hash, expiry, usedAt)
- `src/lib/mailer.ts` — console-logger mailer (TODO: add Resend when ready)
- `src/lib/actions/auth.ts` — `requestPasswordReset()` + `resetPassword()` server actions

## Password Reset Flow
- Token: 32-byte crypto random → stored as SHA-256 hash in PasswordResetToken table
- Expiry: 1 hour; marked usedAt on use; previous tokens invalidated on new request
- Rate limit: 3 requests per 15 min per email (in-memory Map)
- Success always shown (no email existence disclosure)

## Prisma Models
- User: email, passwordHash, role (CUSTOMER/ADMIN/SUPER_ADMIN), emailVerified, etc.
- PasswordResetToken: id, userId, tokenHash (unique), expiresAt, usedAt?, createdAt
- Blob routes (/api/blob/upload + /api/blob/delete) have server-side admin auth guards

## Key Patterns
- Tailwind v4 uses `@theme {}` block instead of config file
- Font variables: `--font-display` (Space Grotesk), `--font-body` (Noto Sans)
- Components use `font-[family-name:var(--font-display)]` for headings
- Primary color: `#0d59f2`, Secondary: `#f05623`
- MaterialIcon component wraps `<span class="material-symbols-outlined">`
- Next.js 16 shows middleware deprecation warning (use "proxy") but middleware still works
- `next lint` was removed in Next.js 16 — use `npx tsc --noEmit` for type checking

## Important Notes
- `prisma generate` runs in build script
- `sitemap.ts` needs `dynamic = "force-dynamic"` to avoid DB connection at build time
- `[[...slug]]` optional catch-all conflicts with `page.tsx` in same route group — use `[...slug]` required catch-all instead
- Static data still in `src/data/siteData.ts` during migration (homepage components still use it)
- Storefront customer login remains at `/uye-girisi-sayfasi` (unchanged)
