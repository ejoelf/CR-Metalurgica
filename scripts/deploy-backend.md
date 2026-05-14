# Deploy backend — CF Metal Pintura PRO

Backend ubicado en:

```txt
apps/api
```

## Plataformas recomendadas

- Railway
- Render
- VPS propio

## Configuración general

### Root Directory

```txt
apps/api
```

### Install Command

```bash
npm install
```

### Build Command

```bash
npm run prisma:generate
```

### Start Command

```bash
npm run start
```

## Variables obligatorias

```env
NODE_ENV="production"
PORT="4000"
API_PREFIX="/api"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_ACCESS_SECRET="valor_seguro"
JWT_REFRESH_SECRET="valor_seguro"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
WEB_URL="https://TU_WEB_URL"
ADMIN_URL="https://TU_ADMIN_URL"
PDF_STORAGE_PATH="storage/pdfs"
EMAIL_PROVIDER="mock"
WHATSAPP_PROVIDER="mock"
AI_PROVIDER="mock"
```

## Migraciones en producción

Antes o durante deploy:

```bash
npm run prisma:deploy
```

## Seed en producción

Ejecutar solo cuando corresponda:

```bash
npm run prisma:seed
```

Antes de ejecutar seed configurar:

```env
SEED_ADMIN_EMAIL="admin@cfmetalpintura.com"
SEED_ADMIN_PASSWORD="valor_seguro"
SEED_SUPPORT_EMAIL="soporte@nexodigital.tech"
SEED_SUPPORT_PASSWORD="valor_seguro"
```

## Seguridad

- Nunca subir `.env` al repo.
- Configurar secretos desde el panel de la plataforma.
- Usar contraseñas fuertes.
- Configurar CORS con URLs reales.
- Activar backups en la base de datos.
- Revisar logs de errores después del primer deploy.

## Healthcheck

```txt
GET https://TU_API_URL/api/health
```
