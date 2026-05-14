# Bloque 2 — Backend completo integrado

## Objetivo

Integrar dentro del repositorio actual `CR-Metalurgica` el backend REST de CF Metal Pintura PRO.

## Stack

- Node.js
- Express
- Prisma Client
- PostgreSQL
- JWT
- Refresh tokens
- Bcrypt
- Zod
- Helmet
- CORS
- Rate limiting
- Morgan

## Estructura agregada

```txt
apps/api/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    ├── middlewares/
    ├── modules/
    ├── routes/
    └── utils/
```

## Módulos incluidos

- Auth
- Users
- Roles
- Clients
- Jobs
- Quotes
- Quote Items
- Incomes
- Expenses
- Finance
- Agenda
- Gallery
- Contact Messages
- Notifications
- Settings

## Endpoints base

```txt
GET    /api/health
POST   /api/contact
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

## Endpoints privados

```txt
/api/users
/api/roles
/api/clients
/api/jobs
/api/quotes
/api/incomes
/api/expenses
/api/finance
/api/agenda
/api/gallery
/api/contact-messages
/api/notifications
/api/settings
```

## Seguridad

- Helmet
- CORS
- Rate limiting
- JWT Access Token
- Refresh Token
- Hash de contraseñas
- Middleware de roles
- Middleware de autenticación
- Manejo centralizado de errores

## Estado

Backend integrado. El schema Prisma definitivo, migraciones y seeds se completan en el Bloque 3.
