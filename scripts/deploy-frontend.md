# Deploy frontend — CF Metal Pintura PRO

El proyecto tiene dos frontends:

```txt
apps/web    → Web pública
apps/admin  → Panel CRM privado
```

## Opción recomendada

Deploy separado por app.

- Web pública en Vercel, Hostinger o similar.
- CRM Admin en Vercel, Hostinger protegido o subdominio privado.

## Deploy web pública en Vercel

### Root Directory

```txt
apps/web
```

### Build Command

```bash
npm run build
```

### Output Directory

```txt
dist
```

### Variables

```env
VITE_PUBLIC_APP_NAME="CF Metal Pintura"
VITE_PUBLIC_API_URL="https://TU_API_URL/api"
VITE_PUBLIC_WHATSAPP_PHONE="5493585719450"
VITE_PUBLIC_GOOGLE_MAPS_URL="https://www.google.com/maps"
VITE_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/cesarromanisio/"
VITE_PUBLIC_FACEBOOK_URL="https://www.facebook.com/CesarRomanisioHig"
```

## Deploy CRM Admin en Vercel

### Root Directory

```txt
apps/admin
```

### Build Command

```bash
npm run build
```

### Output Directory

```txt
dist
```

### Variables

```env
VITE_ADMIN_APP_NAME="CF Metal Pintura PRO"
VITE_ADMIN_API_URL="https://TU_API_URL/api"
```

## Consideraciones

- El CRM no debe indexarse.
- Usar subdominio privado, por ejemplo `admin.cfmetalpintura.com`.
- Configurar correctamente CORS en API.
- No exponer claves privadas en Vite. Solo variables públicas `VITE_`.
