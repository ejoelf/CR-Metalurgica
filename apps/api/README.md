# API — CF Metal Pintura PRO

Backend REST central del sistema CF Metal Pintura PRO.

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

## Responsabilidad

- Autenticación y seguridad.
- Usuarios y roles.
- Clientes.
- Trabajos.
- Presupuestos.
- Ítems de presupuesto.
- Ingresos.
- Egresos.
- Finanzas.
- Agenda.
- Galería.
- Mensajes de contacto.
- Notificaciones.
- Configuración.
- Auditoría.

## Comandos

```bash
npm install
npm run dev
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```

## Healthcheck

```txt
GET /api/health
```

## Nota

Este bloque integra el backend. El schema completo de Prisma, migraciones y seeds definitivos se completan en el Bloque 3.
