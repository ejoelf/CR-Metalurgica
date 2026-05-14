# Setup local — CF Metal Pintura PRO

Guía para levantar el proyecto completo en entorno local.

## 1. Requisitos previos

- Node.js 20 o superior.
- npm 10 o superior.
- PostgreSQL local o base remota.
- Git.

## 2. Instalar dependencias

Desde la raíz del repositorio:

```bash
npm run install:all
```

O manualmente:

```bash
npm install
npm --prefix apps/api install
npm --prefix apps/web install
npm --prefix apps/admin install
```

## 3. Configurar variables de entorno

Copiar archivos de ejemplo:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

Editar especialmente:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cf_metal_pintura_pro"
JWT_ACCESS_SECRET="valor_seguro"
JWT_REFRESH_SECRET="valor_seguro"
SEED_ADMIN_PASSWORD="valor_seguro"
SEED_SUPPORT_PASSWORD="valor_seguro"
```

## 4. Preparar Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 5. Levantar servicios

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

Terminal 3:

```bash
npm run dev:admin
```

## 6. URLs locales

```txt
API:        http://localhost:4000/api/health
Web:        http://localhost:5173
CRM Admin:  http://localhost:5174
```

## 7. Orden recomendado

1. API.
2. Migraciones.
3. Seed.
4. Web pública.
5. CRM.

## 8. Problemas comunes

### DATABASE_URL incorrecta

Revisar usuario, contraseña, host, puerto y nombre de base.

### Prisma Client no generado

Ejecutar:

```bash
npm run prisma:generate
```

### Login no funciona

Confirmar que el seed fue ejecutado y que las variables `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` coinciden.
