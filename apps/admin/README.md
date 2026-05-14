# Panel CRM — CF Metal Pintura PRO

Aplicación privada para gestión operativa del negocio CF Metal Pintura.

## Objetivo

Centralizar clientes, trabajos, presupuestos, finanzas, agenda, galería, mensajes, notificaciones y configuración en un panel moderno y profesional.

## Stack

- React
- Vite
- JavaScript
- React Router DOM
- Framer Motion
- Lucide React
- Recharts
- CSS puro organizado

## Rutas incluidas

```txt
/login
/dashboard
/clientes
/trabajos
/presupuestos
/finanzas
/agenda
/galeria
/mensajes
/notificaciones
/configuracion
```

## Módulos incluidos

- Login
- AuthContext
- Rutas protegidas
- Layout privado
- Sidebar
- Topbar
- Dashboard con KPIs y gráficos
- Clientes
- Trabajos
- Presupuestos
- Finanzas
- Agenda
- Galería administrable
- Mensajes recibidos
- Notificaciones internas
- Configuración

## API preparada

El CRM queda preparado para consumir endpoints privados de la API:

```txt
/api/auth
/api/clients
/api/jobs
/api/quotes
/api/incomes
/api/expenses
/api/agenda
/api/gallery
/api/contact-messages
/api/notifications
/api/settings
```

## Variables de entorno

```env
VITE_ADMIN_APP_NAME="CF Metal Pintura PRO"
VITE_ADMIN_API_URL="http://localhost:4000/api"
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Puerto local

```txt
http://localhost:5174
```

## Estado

Bloque 5 completado. El CRM queda agregado dentro del repositorio actual y preparado para conexión real con el backend y la base de datos.
