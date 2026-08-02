# CLAUDE.md — pymehub

Reglas específicas de este proyecto. Complementan (no reemplazan) `~/.claude/CLAUDE.md`.

## Documento de origen

El spec del proyecto vive en [`docs/_CONCEPTO.md`](docs/_CONCEPTO.md). Toda decisión arquitectónica se valida contra ese doc. Si hay conflicto entre `_CONCEPTO` y este archivo, gana `_CONCEPTO`.

## Stack (resumen, full en `_CONCEPTO.md`)

- **Monorepo**: pnpm workspaces + Turborepo
- **apps/api**: NestJS 11 + Fastify + Prisma 7 + Postgres 16 + Redis 7 (BullMQ) + opossum + Zod + Pino + Vitest
- **apps/web**: Next.js 16 (RSC + Server Actions) + Tailwind 4 + shadcn/ui + Radix + Zustand + Supabase + Vitest + Playwright
- **apps/fondos**: stub aiGenerated (NestJS placeholder)
- **apps/analytics**: stub aiGenerated (FastAPI placeholder)
- **Hosting**: long-running containers (Railway/Render)

## Migraciones pendientes (de templates al concept)

- **api**: ✅ reemplazar `class-validator` + `class-transformer` por `zod` (pipes custom NestJS) — HECHO en scaffold
- **api**: ✅ reemplazar Jest por Vitest (mantener `@nestjs/testing` para módulos) — HECHO en scaffold
- **web**: instalar shadcn/ui + Zustand + Supabase client (no vienen en template-nextjs-fullstack) — FASE_2

## Convenciones de Fase

- F1 (`api` ETL ChileCompra) debe shippear antes de empezar F2.
- F3 (`fondos`) y F4 (`analytics`) son stubs aiGenerated — implementación diferida salvo decisión explícita.
- No commitear `node_modules/`, `.env`, `.next/`, `dist/` (ya en `.gitignore`).

## Resiliencia

- Toda llamada a ChileCompra API pasa por Circuit Breaker (opossum).
- Todo job BullMQ declara `attempts` + `backoff` + `removeOnComplete`/`removeOnFail`.
- BullMQ `failedRegistry` actúa como DLQ — alerta cuando supera threshold.

## Testing

- Unit + Integration: Vitest
- E2E: Playwright solo en F2 (web)
- Mockear ChileCompra HTTP client con `msw` o `nock` en suite unit.

## Secrets

- `.env` por app (`apps/api/.env`, `apps/web/.env.local`).
- Variables sensibles (`DATABASE_URL`, `REDIS_URL`, `SUPABASE_SERVICE_KEY`) nunca en código.
- `.gitignore` excluye todos los `.env*`.

## NestJS + Vitest (vite-node): decorator metadata

`tsc --noEmit` emite decorator metadata (`emitDecoratorMetadata: true` + `reflect-metadata`),
pero **vite-node (Vitest) no**. Sin metadata, NestJS no puede resolver los parámetros
del constructor por tipo — `useValue: mockRepository` se inyecta como `undefined` y
los tests fallan con `Cannot read properties of undefined (reading 'findAll')`.

**Workaround obligatorio**: en cualquier `@Injectable()` con DI por constructor,
agregar `@Inject(Token)` explícito en cada parámetro:

```ts
@Injectable()
export class ExampleService {
  constructor(
    @Inject(ExampleRepository) private readonly repository: ExampleRepository,
    @Inject(PrismaService)     private readonly prisma: PrismaService,
  ) {}
}
```

No cambia runtime (NestJS sigue resolviendo igual). Solo hace el binding explícito
para que vite-node pueda resolverlo sin decorator metadata.

## Limpieza obligatoria al adaptar templates

Cuando se scaffolda desde un template externo (`Freddymhs/template-nest`,
`Freddymhs/template-nextjs-fullstack`), auditar y eliminar rutas, páginas, tests y
dependencias que vengan del template y no apliquen al dominio real. Es parte del
scaffold (FASE_0), no se difiere.

Ejemplos ya aplicados en este proyecto:

- `apps/api/README.md` reescrito como `@pymehub/api` (template-nest default mencionaba
  `docs/IDEA.md` y `docs/fuentes-datos/` que no existen en pymehub).
- `apps/web/README.md` reescrito como `@pymehub/web` (template-nextjs-fullstack
  trae rutas demo `/ssr`, `/ssg`, `/isr`, `/csr`, `/api/hello` que se eliminan
  en FASE_2).