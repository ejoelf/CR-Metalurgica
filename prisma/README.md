# Prisma — CF Metal Pintura PRO

Esta carpeta contiene la configuración de base de datos del proyecto.

## Stack

- PostgreSQL
- Prisma ORM
- Migraciones versionadas
- Seed inicial seguro por variables de entorno

## Archivos

```txt
prisma/
├── schema.prisma
├── seed.js
└── migrations/
    └── 20260514000000_init/
        └── migration.sql
```

## Modelos principales

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

## Comandos

Desde la raíz del repo:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```

## Variables necesarias

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
SEED_ADMIN_EMAIL="admin@cfmetalpintura.com"
SEED_ADMIN_PASSWORD="change_me_admin_password"
SEED_SUPPORT_EMAIL="soporte@nexodigital.tech"
SEED_SUPPORT_PASSWORD="change_me_support_password"
```

## Seguridad

No usar las contraseñas placeholder en producción.

Configurar `SEED_ADMIN_PASSWORD` y `SEED_SUPPORT_PASSWORD` con valores fuertes antes de ejecutar el seed en un entorno real.
