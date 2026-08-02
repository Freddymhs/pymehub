# Flow Validation Document — pymehub

> Documento mantenido manualmente. Describe cómo funciona la app para el usuario final.
> Llenar cada flujo después de probarlo. Útil como guía para `/tools:testing:run-browser-testing`.
>
> Última actualización: 2026-08-01

---

## Convenciones

- **Precondiciones**: qué debe existir antes de ejecutar el flujo
- **Pasos**: acciones del usuario (navegar, click, escribir, etc.)
- **Resultado esperado**: qué ve/obtiene el usuario al completar
- **Casos borde**: situaciones alternativas relevantes

---

## Módulo: Autenticación

### Flujo: Login con email/password

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- (por llenar)

---

### Flujo: Logout

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- (por llenar)

---

## Módulo: Dashboard

### Flujo: Ver lista de licitaciones

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- Lista vacía (pre-ingesta)
- Error de conexión a api

---

### Flujo: Ver detalle de licitación

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- Licitación no existe
- RLS bloquea acceso

---

### Flujo: Marcar como favorito

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- Click doble (idempotencia)
- Sesión expirada

---

## Módulo: Ingesta (background)

### Flujo: ETL diario automático

**Precondiciones:**
- (por llenar)

**Pasos:**
1. (por llenar)

**Resultado esperado:**
- (por llenar)

**Casos borde:**
- API ChileCompra caída → Circuit Breaker abre
- DB no disponible → job reintenta con backoff
- Job falla 3 veces → DLQ + alerta