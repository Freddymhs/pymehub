# @pymehub/analytics (aiGenerated stub)

> 🤖 **aiGenerated**: este proyecto está marcado como `aiGenerated: true` en `resume.json`.
> Solo esta carpeta existe como placeholder estructural para que el monorepo muestre los 4 servicios en CV.
> **Sin código de implementación real** — la implementación se difiere a F4 del backlog.

## Diseño planeado (F4)

Servicio de ML para ranking de licitaciones + RAG sobre datos históricos + análisis de redes de proveedores (SNA).

### Stack objetivo

- FastAPI + Python 3.12 (mejor ecosystem ML)
- XGBoost / LightGBM para ranking
- SMOTE para balanceo
- LlamaIndex + pgvector para RAG
- NetworkX + Sigma.js para SNA
- Lee datos del Postgres de `@pymehub/api` (read replica)

### Alcance F4

- ETL bulk OCDS hacia features ML
- XGBoost ranking (probabilidad de adjudicación)
- SMOTE para balancear clases raras
- SNA: detectar endogamia (red de proveedores recurrentes)
- RAG LlamaIndex: consultas en lenguaje natural sobre histórico
- Visualización Sigma.js de grafos

### Bloqueo histórico

ParaPymes original tenía FASE_5/6 bloqueadas por falta de datos (>= 3 meses en MongoDB). En pymehub, F4 sigue bloqueada hasta que `@pymehub/api` acumule histórico suficiente.

### Por qué no implementar ahora

- F1 (`api`) debe correr ≥3 meses antes de tener datos
- ML/RAG no aporta valor sin datos reales
- El stub mantiene el brand sin inflar el repo

## Cuándo implementar

Tras ≥3 meses de F1 produciendo datos, o cuando haya interés concreto en ML/BI.