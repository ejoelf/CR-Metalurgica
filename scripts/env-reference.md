# Referencia de variables de entorno — CF Metal Pintura PRO

## Variables globales

```env
PROJECT_NAME="CF Metal Pintura PRO"
PROJECT_ENV="development"
WEB_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"
API_URL="http://localhost:4000"
```

## Backend API

```env
NODE_ENV="development"
PORT="4000"
API_PREFIX="/api"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

## Seed

```env
SEED_ADMIN_EMAIL="admin@cfmetalpintura.com"
SEED_ADMIN_PASSWORD="change_me_admin_password"
SEED_SUPPORT_EMAIL="soporte@nexodigital.tech"
SEED_SUPPORT_PASSWORD="change_me_support_password"
```

## Web pública

```env
VITE_PUBLIC_APP_NAME="CF Metal Pintura"
VITE_PUBLIC_API_URL="http://localhost:4000/api"
VITE_PUBLIC_WHATSAPP_PHONE="5493585719450"
VITE_PUBLIC_GOOGLE_MAPS_URL="https://www.google.com/maps"
VITE_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/cesarromanisio/"
VITE_PUBLIC_FACEBOOK_URL="https://www.facebook.com/CesarRomanisioHig"
```

## CRM Admin

```env
VITE_ADMIN_APP_NAME="CF Metal Pintura PRO"
VITE_ADMIN_API_URL="http://localhost:4000/api"
```

## PDF

```env
PDF_STORAGE_PATH="storage/pdfs"
```

## Email

```env
EMAIL_PROVIDER="mock"
EMAIL_FROM="CF Metal Pintura <no-reply@cfmetalpintura.com>"
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

## WhatsApp

```env
WHATSAPP_PROVIDER="mock"
WHATSAPP_BUSINESS_PHONE="5493585719450"
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_API_TOKEN=""
```

## IA

```env
AI_PROVIDER="mock"
AI_API_KEY=""
```

## Reglas

- No subir archivos `.env`.
- Usar secretos fuertes.
- No exponer claves privadas en variables `VITE_`.
- Configurar variables desde el panel de Render, Railway, Vercel o VPS.
