# Bloque 7 — Scripts + configuración

## Objetivo

Agregar guías operativas y configuración documental para instalar, ejecutar, verificar, migrar y desplegar CF Metal Pintura PRO dentro del repositorio actual.

## Archivos agregados

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

## Setup local

Documentado en:

```txt
scripts/setup-local.md
```

Incluye:

- requisitos previos;
- instalación de dependencias;
- configuración de `.env`;
- comandos Prisma;
- ejecución de API, web pública y CRM;
- URLs locales;
- problemas comunes.

## Deploy frontend

Documentado en:

```txt
scripts/deploy-frontend.md
```

Incluye:

- deploy de `apps/web`;
- deploy de `apps/admin`;
- configuración para Vercel/Hostinger;
- root directory;
- build command;
- output directory;
- variables `VITE_`.

## Deploy backend

Documentado en:

```txt
scripts/deploy-backend.md
```

Incluye:

- deploy de `apps/api`;
- Railway / Render / VPS;
- install command;
- build command;
- start command;
- variables obligatorias;
- healthcheck;
- seguridad.

## Migraciones producción

Documentado en:

```txt
scripts/migrate-production.md
```

Incluye:

- uso de `prisma migrate deploy`;
- checklist previo;
- revisión posterior;
- política de rollback;
- buenas prácticas.

## Checklist técnico

Documentado en:

```txt
scripts/check-project.md
```

Incluye verificación de:

- instalación;
- variables de entorno;
- base de datos;
- backend;
- web pública;
- CRM;
- integraciones;
- seguridad;
- producción.

## Referencia de entorno

Documentado en:

```txt
scripts/env-reference.md
```

Incluye variables para:

- raíz;
- backend;
- seed;
- web pública;
- CRM;
- PDF;
- Email;
- WhatsApp;
- IA.

## Decisiones técnicas

- No se agregan nuevas funcionalidades en este bloque.
- No se ejecuta deploy real.
- No se agregan credenciales reales.
- Se documenta el flujo operativo para uso local y producción.
- Se mantiene todo dentro del repositorio actual `CR-Metalurgica`.

## Estado

Bloque 7 completado. El proyecto queda preparado con guías de instalación, verificación, migración y deploy.
