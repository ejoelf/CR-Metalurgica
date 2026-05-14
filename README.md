# CF Metal Pintura PRO

Sistema profesional desarrollado por **NexoDigital** para transformar la web original de CF Metal Pintura en una plataforma integral con **web pública moderna**, **panel CRM privado**, **backend API**, **base de datos PostgreSQL**, **presupuestos**, **finanzas**, **agenda**, **galería administrable**, **notificaciones** e **integraciones preparadas** para PDF, WhatsApp, Email e IA.

Este repositorio conserva el proyecto original `CR-Metalurgica` y lo evoluciona progresivamente hacia **CF Metal Pintura PRO**, sin crear un repositorio nuevo.

---

## Visión general

CF Metal Pintura PRO está pensado para digitalizar la operación de un negocio real de herrería, metalúrgica, pintura, durlock y electricidad.

El objetivo es que el negocio pueda:

- mostrar una imagen pública profesional;
- recibir consultas desde la web;
- convertir consultas en clientes;
- crear y seguir trabajos;
- generar presupuestos;
- registrar ingresos y egresos;
- administrar agenda y entregas;
- publicar trabajos en galería;
- centralizar notificaciones internas;
- preparar automatizaciones con WhatsApp, Email, PDF e IA.

---

## Arquitectura general

El repositorio quedó organizado como un **monorepo simple**:

```txt
CR-Metalurgica/
├── apps/
│   ├── api/        # Backend REST Node.js + Express + Prisma
│   ├── web/        # Web pública React + Vite
│   └── admin/      # Panel CRM privado React + Vite
├── prisma/         # Schema, migraciones y seed
├── packages/       # Configuración, constantes y utilidades compartidas
├── scripts/        # Guías operativas, deploy y setup
├── docs/           # Documentación técnica por bloque
├── storage/        # Storage local para PDFs/archivos en desarrollo
├── src/            # App legacy original conservada temporalmente
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Aplicaciones

### `apps/web`

Web pública del negocio.

Incluye:

- Inicio;
- Servicios;
- Trabajos realizados;
- Galería;
- Sobre nosotros;
- Presupuestos;
- Contacto;
- WhatsApp directo;
- Opiniones;
- Ubicación con Google Maps;
- SEO básico;
- OpenGraph básico;
- formulario conectado al backend.

### `apps/admin`

Panel CRM privado.

Incluye:

- Login;
- AuthContext;
- rutas protegidas;
- dashboard;
- clientes;
- trabajos;
- presupuestos;
- finanzas;
- agenda;
- galería administrable;
- mensajes recibidos;
- notificaciones;
- configuración.

### `apps/api`

Backend REST central.

Incluye:

- Express;
- Prisma Client;
- PostgreSQL;
- JWT auth;
- refresh tokens;
- roles;
- middlewares;
- validaciones;
- manejo de errores;
- CRUDs principales;
- lógica de negocio;
- integraciones preparadas.

---

## Tecnologías utilizadas

### Frontend público

- React
- Vite
- JavaScript
- React Router DOM
- Framer Motion
- Lucide React
- CSS puro organizado

### CRM privado

- React
- Vite
- JavaScript
- React Router DOM
- Recharts
- Lucide React
- CSS puro organizado

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Zod
- Helmet
- CORS
- Morgan
- Rate limiting

### Integraciones

- PDFKit
- Nodemailer
- WhatsApp layer mock/preparado
- IA rule-based inicial/preparada para proveedor externo

---

## Módulos del sistema

### CRM / Operación

- Usuarios
- Roles
- Clientes
- Trabajos
- Presupuestos
- Ítems de presupuesto
- Ingresos
- Egresos
- Finanzas
- Agenda
- Galería
- Mensajes de contacto
- Notificaciones
- Configuración
- Auditoría

### Integraciones

- PDFs de presupuestos
- WhatsApp preparado
- Email preparado
- IA inicial
- Logs de mensajes
- Sugerencias IA persistidas

---

## Flujo operativo del negocio

```txt
Consulta web / WhatsApp
        ↓
Mensaje en CRM
        ↓
Conversión a cliente
        ↓
Creación de trabajo
        ↓
Presupuesto con ítems, materiales, mano de obra y margen
        ↓
Generación de PDF
        ↓
Envío preparado por WhatsApp / Email
        ↓
Aprobación
        ↓
Trabajo en producción / pintura / entrega
        ↓
Registro de ingresos y egresos
        ↓
Balance, agenda, historial y galería pública
```

---

## Base de datos

Motor definido:

```txt
PostgreSQL
```

ORM:

```txt
Prisma
```

Modelos principales:

```txt
Role
User
RefreshToken
Client
Job
Quote
QuoteItem
Income
Expense
AgendaEvent
GalleryItem
ContactMessage
Notification
BusinessSettings
File
AuditLog
PdfDocument
MessageLog
AiSuggestion
```

Ubicación:

```txt
prisma/schema.prisma
```

Migración inicial:

```txt
prisma/migrations/20260514000000_init/migration.sql
```

Seed:

```txt
prisma/seed.js
```

---

## Endpoints principales

### Healthcheck

```txt
GET /api/health
```

### Público

```txt
POST /api/contact
GET  /api/gallery/public
GET  /api/public/quotes/:token/download
```

### Auth

```txt
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### CRM privado

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

### Integraciones

```txt
POST /api/integrations/quotes/:quoteId/pdf
POST /api/integrations/quotes/:quoteId/whatsapp
POST /api/integrations/quotes/:quoteId/email
POST /api/integrations/whatsapp/send
POST /api/integrations/email/send
POST /api/integrations/ai/quote-suggestions
POST /api/integrations/ai/commercial-text
POST /api/integrations/ai/material-suggestions
POST /api/integrations/ai/analyze-job
```

---

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- PostgreSQL local o remoto
- Git

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ejoelf/CR-Metalurgica.git
cd CR-Metalurgica
```

### 2. Instalar dependencias

```bash
npm run install:all
```

### 3. Crear variables de entorno

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

### 4. Configurar base de datos

Editar:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cf_metal_pintura_pro"
```

### 5. Generar Prisma Client

```bash
npm run prisma:generate
```

### 6. Ejecutar migraciones

```bash
npm run prisma:migrate
```

### 7. Ejecutar seed

```bash
npm run prisma:seed
```

### 8. Levantar backend

```bash
npm run dev:api
```

### 9. Levantar web pública

```bash
npm run dev:web
```

### 10. Levantar CRM

```bash
npm run dev:admin
```

---

## URLs locales

```txt
API:        http://localhost:4000/api/health
Web:        http://localhost:5173
CRM Admin:  http://localhost:5174
```

---

## Scripts principales

Desde raíz:

```bash
npm run dev:api
npm run dev:web
npm run dev:admin
npm run build:web
npm run build:admin
npm run start:api
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run install:all
```

---

## Variables de entorno

Referencia completa:

```txt
scripts/env-reference.md
```

Variables críticas:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
SEED_ADMIN_EMAIL="admin@cfmetalpintura.com"
SEED_ADMIN_PASSWORD="change_me_admin_password"
SEED_SUPPORT_EMAIL="soporte@nexodigital.tech"
SEED_SUPPORT_PASSWORD="change_me_support_password"
WEB_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"
```

Regla obligatoria:

```txt
Nunca subir archivos .env ni credenciales reales al repositorio.
```

---

## Cómo usar la web pública

Abrir:

```txt
http://localhost:5173
```

Desde la web se puede:

- conocer servicios;
- ver trabajos;
- revisar galería;
- pedir presupuesto;
- enviar consulta al backend;
- abrir WhatsApp directo;
- ver ubicación.

---

## Cómo usar el CRM

Abrir:

```txt
http://localhost:5174
```

El CRM permite gestionar:

- dashboard;
- clientes;
- trabajos;
- presupuestos;
- finanzas;
- agenda;
- galería;
- mensajes;
- notificaciones;
- configuración.

El login utiliza usuarios creados por el seed. Las credenciales deben configurarse mediante variables de entorno antes de ejecutar el seed.

---

## Cómo generar PDFs

Endpoint privado:

```txt
POST /api/integrations/quotes/:quoteId/pdf
```

Resultado esperado:

```json
{
  "success": true,
  "message": "PDF de presupuesto generado correctamente",
  "data": {
    "fileName": "presupuesto-P-0001.pdf",
    "publicUrl": "/api/public/quotes/:token/download"
  }
}
```

Descarga pública segura:

```txt
GET /api/public/quotes/:token/download
```

---

## Integraciones

### PDF

- Generación local con PDFKit.
- Registro en `PdfDocument`.
- URL pública por token.
- Preparado para migrar a Cloudinary, S3, Supabase Storage o R2.

### WhatsApp

- Modo mock por defecto.
- Servicio `sendWhatsAppMessage(payload)`.
- Plantillas preparadas.
- Logs en `MessageLog`.
- Preparado para Meta WhatsApp Business Cloud API.

### Email

- Modo mock por defecto.
- SMTP preparado con Nodemailer.
- Plantillas HTML.
- Logs en `MessageLog`.
- Preparado para Resend, SendGrid, Mailgun o AWS SES.

### IA

- IA inicial rule-based.
- Sugerencias de presupuesto.
- Textos comerciales.
- Sugerencias de materiales.
- Análisis básico de trabajos.
- Persistencia en `AiSuggestion`.
- Preparado para OpenAI, Claude, Gemini, Ollama u otros proveedores.

---

## Deploy

Guías disponibles:

```txt
scripts/deploy-frontend.md
scripts/deploy-backend.md
scripts/migrate-production.md
```

### Frontend

Apps:

```txt
apps/web
apps/admin
```

Deploy recomendado:

- Vercel
- Hostinger
- Netlify
- VPS con Nginx

### Backend

App:

```txt
apps/api
```

Deploy recomendado:

- Railway
- Render
- VPS

### Base de datos

Recomendado:

- PostgreSQL en Railway
- PostgreSQL en Render
- Neon
- Supabase PostgreSQL
- VPS PostgreSQL administrado

---

## Seguridad

Incluido:

- JWT auth;
- refresh tokens;
- hash de contraseñas con bcrypt;
- roles;
- protección de rutas privadas;
- Helmet;
- CORS;
- rate limiting;
- manejo centralizado de errores;
- variables de entorno;
- logs de mensajes;
- tokens públicos para PDFs.

Pendiente para producción real:

- configurar secretos fuertes;
- activar backups;
- configurar dominios y SSL;
- revisar CORS final;
- configurar proveedor real de email;
- configurar proveedor real de WhatsApp;
- configurar storage externo para PDFs;
- monitoreo y alertas.

---

## Documentación técnica

```txt
docs/
├── 01-diagnostico-repo-actual.md
├── 02-estructura-repositorio.md
├── 03-backend-integrado.md
├── 04-prisma-database.md
├── 05-web-publica.md
├── 06-panel-crm.md
├── 07-integraciones.md
└── 08-scripts-configuracion.md
```

---

## Scripts y guías

```txt
scripts/
├── README.md
├── setup-local.md
├── deploy-frontend.md
├── deploy-backend.md
├── migrate-production.md
├── check-project.md
└── env-reference.md
```

---

## Estado de bloques completados

- Bloque 1: nueva estructura del repo + archivos base.
- Bloque 2: backend completo integrado.
- Bloque 3: Prisma + migraciones + seeds.
- Bloque 4: web pública actualizada.
- Bloque 5: panel CRM agregado.
- Bloque 6: integraciones PDF, WhatsApp, Email e IA.
- Bloque 7: scripts + configuración.
- Bloque 8: README final actualizado.

---

## Roadmap futuro

- Conectar proveedores reales de WhatsApp Business.
- Conectar proveedor real de email.
- Migrar PDFs a storage cloud.
- Mejorar formularios CRUD del CRM.
- Agregar edición detallada de clientes, trabajos y presupuestos.
- Agregar carga real de imágenes.
- Agregar reportes avanzados.
- Agregar auditoría visual.
- Agregar modo oscuro.
- Agregar notificaciones en tiempo real.
- Integrar IA real para asistencia comercial y presupuestos.
- Preparar app móvil o PWA.

---

## Créditos

Proyecto desarrollado y estructurado por **NexoDigital**.

Dirección técnica, arquitectura y evolución del sistema: **NexoDigital · CF Metal Pintura PRO**.
