# @pymehub/web

Dashboard BFF para PYMEs chilenas proveedoras del Estado. Next.js 16 con App Router,
RSC puro + Server Actions, shadcn/ui + Radix, Zustand para client state, Supabase para auth.

## Quick start

```bash
# 1. Instalar deps
pnpm install

# 2. Variables de entorno (Supabase)
cp .env.example .env.local
# editar .env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Dev (puerto 3001)
pnpm dev
```

## Stack

- **Next.js 16** (App Router, RSC puro + Server Actions)
- **React 19** (Server Components by default)
- **TypeScript** strict
- **TailwindCSS 4**
- **shadcn/ui + Radix** (componentes accesibles)
- **Zustand** (client state efímero)
- **Supabase** (auth + Postgres + RLS)
- **Vitest + happy-dom** (testing)
- **Playwright** (e2e — FASE_2)

## Arquitectura: BFF

`apps/web` actúa como Backend-For-Frontend: agrega respuestas de `apps/api`,
hace auth check contra Supabase, y nunca expone el cliente api al browser.

Las rutas autenticadas viven bajo `src/app/(authed)/`. El middleware de Supabase
protege ese segmento.

## Scripts

| Script          | Descripcion                              |
| --------------- | ---------------------------------------- |
| `pnpm dev`      | Dev server en :3001                      |
| `pnpm build`    | Build producción                         |
| `pnpm start`    | Ejecutar build                           |
| `pnpm lint`     | ESLint + Prettier                        |
| `pnpm test`     | Vitest unit/component                    |
| `pnpm test:e2e` | Playwright e2e (FASE_2)                  |

## Migración pendiente desde template

Por defecto `template-nextjs-fullstack` trae rutas demo (`/ssr`, `/ssg`, `/isr`,
`/csr`, `/api/hello`) para mostrar cada patrón de rendering. **Estas rutas se
eliminan en FASE_2** porque no aportan al producto — pymehub usa RSC puro +
Server Actions (ver `docs/_CONCEPTO.md`).

## Licencia

Privado.