# Checklist técnico local — CF Metal Pintura PRO

## 1. Instalación

```bash
npm run install:all
```

Verificar que no haya errores en:

- raíz
- `apps/api`
- `apps/web`
- `apps/admin`

## 2. Variables de entorno

Confirmar existencia de:

```txt
.env
apps/api/.env
apps/web/.env
apps/admin/.env
```

## 3. Base de datos

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 4. Backend

```bash
npm run dev:api
```

Probar:

```txt
GET http://localhost:4000/api/health
```

## 5. Web pública

```bash
npm run dev:web
```

Probar:

```txt
http://localhost:5173
```

Verificar:

- Inicio
- Servicios
- Trabajos
- Galería
- Nosotros
- Presupuestos
- Contacto
- WhatsApp
- Maps

## 6. CRM

```bash
npm run dev:admin
```

Probar:

```txt
http://localhost:5174
```

Verificar:

- Login
- Dashboard
- Clientes
- Trabajos
- Presupuestos
- Finanzas
- Agenda
- Galería
- Mensajes
- Notificaciones
- Configuración

## 7. Integraciones

Verificar endpoints privados:

```txt
POST /api/integrations/quotes/:quoteId/pdf
POST /api/integrations/quotes/:quoteId/whatsapp
POST /api/integrations/quotes/:quoteId/email
POST /api/integrations/ai/quote-suggestions
```

## 8. Seguridad

Confirmar:

- `.env` no versionado.
- JWT secrets fuertes.
- Seed passwords fuertes.
- CORS con URLs correctas.
- Admin no indexado.

## 9. Producción

Antes de deploy:

- Revisar variables reales.
- Activar backups DB.
- Ejecutar migraciones en staging.
- Probar login.
- Probar PDF.
- Probar formulario público.
