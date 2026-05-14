# Bloque 4 — Web pública actualizada

## Objetivo

Transformar la web pública actual en una aplicación moderna, profesional y preparada para integrarse con el backend de CF Metal Pintura PRO.

## Ubicación

```txt
apps/web/
```

## Stack

- React
- Vite
- JavaScript
- React Router DOM
- Framer Motion
- Lucide React
- CSS puro organizado

## Estructura creada

```txt
apps/web/
├── package.json
├── .env.example
├── index.html
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── common/
    │   ├── layout/
    │   └── sections/
    ├── data/
    ├── hooks/
    ├── pages/
    ├── services/
    ├── styles/
    └── utils/
```

## Páginas implementadas

- Inicio
- Servicios
- Trabajos realizados
- Galería
- Sobre nosotros
- Presupuestos
- Contacto
- Página 404

## Secciones incluidas

- Hero profesional
- Servicios
- Trabajos realizados
- Proceso de trabajo
- Beneficios
- Opiniones
- Formulario de contacto
- Ubicación con Maps
- WhatsApp directo

## Conexión API preparada

```txt
GET  /api/gallery/public
POST /api/contact
```

## Decisiones técnicas

- Se conserva el repositorio actual.
- Se crea `apps/web` como nueva app pública PRO.
- La carpeta legacy `src/` queda temporalmente sin eliminar.
- El formulario ya apunta al backend propio, no a Formspree.
- La galería usa fallback local y queda preparada para datos del CRM.
- Se centralizan textos/datos públicos en `siteData.js`.

## SEO

Incluido en `index.html`:

- title
- description
- robots
- OpenGraph básico
- favicon

Además se agregó utilidad `updateSeo()` para títulos y descripciones por página.

## Responsividad

La web cuenta con:

- Header responsive
- Menú móvil
- Grillas adaptables
- Formularios mobile-friendly
- CTA optimizados para celular
- WhatsApp flotante

## Nota sobre imágenes

Se reutilizaron referencias de imágenes actuales del proyecto. En una pasada posterior conviene copiar los assets definitivos a `apps/web/public/assets/projects/` o consumirlos desde la galería administrable del CRM.

## Estado

Bloque 4 completado. La web pública queda lista para probarse con:

```bash
npm --prefix apps/web install
npm --prefix apps/web run dev
```
