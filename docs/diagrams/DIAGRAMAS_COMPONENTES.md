# Diagramas de Componentes (Flowcharts)

> Propósito: mapa estable del sistema. Actualizar solo si cambia topología.

## Contexto (alto nivel)

```mermaid
flowchart LR
    PYME[👤 PYME chilena]
    Browser[🌐 Browser Next.js]
    Web[apps/web<br/>Next.js 16 BFF]
    Api[apps/api<br/>NestJS 11]
    Worker[BullMQ Worker]
    CC[🇨🇱 ChileCompra API]
    DB[(Postgres 16)]
    Redis[(Redis 7)]
    SB[Supabase Auth]
    F[apps/fondos<br/>aiGenerated stub]
    A[apps/analytics<br/>aiGenerated stub]

    PYME --> Browser
    Browser --> Web
    Web -->|BFF fetch| Api
    Web -->|auth| SB
    Api -->|REST + bulk OCDS| CC
    Api -->|enqueue| Redis
    Redis -->|dequeue| Worker
    Worker -->|UPSERT| DB
    Api -->|read/write| DB
    Worker -.->|planeado F3| F
    DB -.->|read replica F4| A
```

## Componentes principales

```mermaid
flowchart TB
    subgraph Cliente
        PYME[👤 Usuario PYME]
        Browser[🌐 Next.js Client]
    end

    subgraph Apps["apps/ (monorepo)"]
        Web[web<br/>Next.js 16<br/>RSC + Server Actions<br/>shadcn/ui + Zustand]
        Api[api<br/>NestJS 11 + Fastify<br/>Prisma 7 + opossum + Zod]
        Fondos[fondos<br/>aiGenerated stub]
        Analytics[analytics<br/>aiGenerated stub]
    end

    subgraph Servicios["Servicios externos"]
        CC[ChileCompra API]
        SB[Supabase<br/>Postgres + Auth + RLS]
        Bull[Bull Board<br/>queue dashboard]
    end

    subgraph Infra["Infraestructura"]
        PG[(Postgres 16)]
        RD[(Redis 7<br/>BullMQ + cache)]
    end

    PYME --> Browser
    Browser -->|HTTPS| Web
    Web -->|auth| SB
    Web -->|fetch RSC| Api
    Web -->|RLS| SB

    Api -->|ingesta diaria| CC
    Api -->|enqueue jobs| RD
    Api -->|CRUD| PG
    Api -->|logs| Bull

    RD -.->|dequeue| Api

    Fondos -.->|planeado F3| CC
    Analytics -.->|planeado F4| PG

    style Fondos fill:#888,stroke:#444,color:#fff
    style Analytics fill:#888,stroke:#444,color:#fff
```

## Flujo de datos: ETL ChileCompra

```mermaid
flowchart LR
    Cron[BullMQ cron<br/>3 AM Chile]
    Q[Redis queue<br/>chile-comppa-daily]
    P[Processor]
    CB[opossum<br/>Circuit Breaker]
    HTTP[ChileCompra REST]
    U{¿UPSERT?}
    DB[(Postgres<br/>Licitacion)]

    Cron --> Q
    Q --> P
    P --> CB --> HTTP --> CB
    CB -->|response validada Zod| P
    P --> U
    U -->|codigoExterno UNIQUE| DB
    U -->|fail| DLQ[failedRegistry<br/>DLQ]
```

## Flujo de datos: BFF Web → API

```mermaid
flowchart LR
    U[👤 User]
    RSC[Server Component<br/>RSC fetch]
    RH[Route Handler<br/>BFF agregador]
    API[apps/api<br/>GET /licitaciones]
    Cache[(Redis cache<br/>60s TTL)]

    U --> RSC
    RSC --> RH
    RH -->|cache hit| Cache
    RH -->|cache miss| API
    API --> RH
    RH --> Cache
    RH --> RSC
    RSC --> U
```