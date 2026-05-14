# Web pública — CF Metal Pintura PRO

Aplicación pública moderna de CF Metal Pintura PRO.

## Objetivo

Presentar profesionalmente el negocio, mostrar servicios y trabajos realizados, captar consultas y conectar la web con la API del sistema.

## Stack

- React
- Vite
- JavaScript
- React Router DOM
- Framer Motion
- Lucide React
- CSS puro organizado

## Páginas incluidas

```txt
/
/servicios
/trabajos
/galeria
/nosotros
/presupuestos
/contacto
```

## Módulos visuales

- Header responsive
- Footer profesional
- Botón flotante de WhatsApp
- Hero principal
- Servicios
- Trabajos realizados
- Galería filtrable
- Proceso de trabajo
- Beneficios
- Opiniones
- Formulario de contacto
- Ubicación con Google Maps

## API preparada

La web queda preparada para consumir:

```txt
GET  /api/gallery/public
POST /api/contact
```

## Variables de entorno

```env
VITE_PUBLIC_APP_NAME="CF Metal Pintura"
VITE_PUBLIC_API_URL="http://localhost:4000/api"
VITE_PUBLIC_WHATSAPP_PHONE="5493585719450"
VITE_PUBLIC_GOOGLE_MAPS_URL="https://www.google.com/maps"
VITE_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/cesarromanisio/"
VITE_PUBLIC_FACEBOOK_URL="https://www.facebook.com/CesarRomanisioHig"
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
http://localhost:5173
```

## Nota sobre imágenes

La web usa rutas públicas preparadas para imágenes reales del proyecto. En el Bloque 4 se conservaron las referencias visuales existentes y la galería queda lista para reemplazarse por datos administrados desde el CRM.
