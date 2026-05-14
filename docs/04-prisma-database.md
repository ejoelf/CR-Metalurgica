# Bloque 3 — Prisma + PostgreSQL + Seeds

## Objetivo

Completar la capa de base de datos de CF Metal Pintura PRO dentro del repositorio existente `CR-Metalurgica`.

## Archivos agregados

```txt
prisma/
├── schema.prisma
├── seed.js
└── migrations/
    └── 20260514000000_init/
        └── migration.sql
```

## Base de datos

Motor definido:

```txt
PostgreSQL
```

ORM definido:

```txt
Prisma
```

## Modelos incluidos

- Role
- User
- RefreshToken
- Client
- Job
- Quote
- QuoteItem
- Income
- Expense
- AgendaEvent
- GalleryItem
- ContactMessage
- Notification
- BusinessSettings
- File
- AuditLog
- PdfDocument
- MessageLog
- AiSuggestion

## Relaciones principales

```txt
Role 1:N User
User 1:N RefreshToken
Client 1:N Job
Client 1:N Quote
Client 1:N Income
Job 1:N Quote
Job 1:N Income
Job 1:N Expense
Job 1:N AgendaEvent
Quote 1:N QuoteItem
Quote 1:N Income
Quote 1:N PdfDocument
User 1:N Notification
User 1:N AuditLog
```

## Enums principales

- ClientStatus
- JobStatus
- JobPriority
- QuoteStatus
- PaymentMethod
- IncomeStatus
- AgendaType
- AgendaStatus
- NotificationType
- ContactMessageStatus

## Seed inicial

El seed crea:

- Roles base: `super_admin`, `admin`, `staff`
- Usuario admin configurable por entorno
- Usuario soporte configurable por entorno
- Configuración del negocio
- Cliente demo
- Trabajo demo
- Presupuesto demo
- Galería inicial basada en imágenes actuales del proyecto
- Notificación inicial

## Variables de seed

```env
SEED_ADMIN_EMAIL="admin@cfmetalpintura.com"
SEED_ADMIN_PASSWORD="change_me_admin_password"
SEED_SUPPORT_EMAIL="soporte@nexodigital.tech"
SEED_SUPPORT_PASSWORD="change_me_support_password"
```

## Comandos

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```

## Reglas de seguridad

- No guardar credenciales reales en el repo.
- Usar contraseñas fuertes en variables de entorno.
- Ejecutar `prisma:deploy` en producción.
- Ejecutar `prisma:migrate` solo en desarrollo.
- Revisar backups antes de migrar una DB productiva.

## Estado

Bloque 3 completado. El backend ya tiene schema, migración inicial y seed preparado.
