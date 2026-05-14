# Bloque 1 — Nueva estructura del repositorio

## Objetivo

Reorganizar el repositorio existente `CR-Metalurgica` para convertirlo en la base de CF Metal Pintura PRO.

## Estructura objetivo

```txt
CR-Metalurgica/
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
├── packages/
│   ├── config/
│   ├── constants/
│   └── utils/
├── prisma/
├── docs/
├── scripts/
├── storage/
├── src/                  # legado temporal hasta Bloque 4
├── package.json
├── .env.example
└── .gitignore
```

## Decisión importante

Durante el Bloque 1 se conserva `src/` como aplicación legacy temporal para no perder branding, textos, imágenes ni componentes útiles.

La migración definitiva de la web pública se realiza en el Bloque 4.

## Estado

Bloque 1 aplicado sobre el repositorio existente, sin crear repositorio nuevo.
