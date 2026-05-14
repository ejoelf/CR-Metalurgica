# Bloque 5 — Panel CRM agregado

## Objetivo

Agregar al repositorio actual el panel CRM privado de CF Metal Pintura PRO.

## Ubicación

```txt
apps/admin/
```

## Stack

- React
- Vite
- JavaScript
- React Router DOM
- Framer Motion
- Lucide React
- Recharts
- CSS puro organizado

## Estructura creada

```txt
apps/admin/
├── package.json
├── .env.example
├── index.html
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── common/
    │   └── layout/
    ├── context/
    ├── hooks/
    ├── pages/
    ├── routes/
    ├── services/
    └── styles/
```

## Módulos incluidos

- Login
- AuthContext
- Rutas protegidas
- Layout privado
- Sidebar
- Topbar
- Dashboard
- Clientes
- Trabajos
- Presupuestos
- Finanzas
- Agenda
- Galería administrable
- Mensajes
- Notificaciones
- Configuración

## Conexión API preparada

```txt
POST /api/auth/login
GET  /api/auth/me
GET  /api/clients
GET  /api/jobs
GET  /api/quotes
GET  /api/incomes
GET  /api/expenses
GET  /api/agenda
GET  /api/gallery
GET  /api/contact-messages
GET  /api/notifications
```

## Decisiones técnicas

- El CRM vive separado de la web pública en `apps/admin`.
- Las rutas privadas están protegidas con `ProtectedRoute`.
- El token se guarda temporalmente en `localStorage` para esta versión inicial.
- Los módulos usan `resourceService` para consumir la API.
- Cada página incluye datos fallback para desarrollo visual aunque la API no esté levantada.
- La generación de PDF, WhatsApp, Email e IA queda reservada para Bloque 6.

## Estado

Bloque 5 completado. El panel CRM queda agregado y preparado para conexión real con backend y base de datos.
