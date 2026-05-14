# Migraciones de producción — CF Metal Pintura PRO

## Objetivo

Aplicar migraciones Prisma en una base PostgreSQL de staging o producción de forma segura.

## Comando recomendado

Desde `apps/api`:

```bash
npm run prisma:deploy
```

Desde raíz:

```bash
npm run prisma:deploy
```

## Antes de migrar

Verificar:

- `DATABASE_URL` apunta al entorno correcto.
- Existe backup reciente.
- El backend está detenido o preparado para deploy.
- La migración fue probada en local/staging.
- No hay cambios manuales no versionados en DB.

## Después de migrar

Ejecutar:

```bash
npm run prisma:generate
```

Verificar healthcheck:

```txt
GET /api/health
```

Probar:

- Login.
- Listado de clientes.
- Crear consulta pública.
- Crear presupuesto.
- Generar PDF.

## Rollback

Prisma no recomienda rollback automático sin estrategia previa.

En caso de problema:

1. Detener deploy.
2. Revisar logs.
3. Restaurar backup si es necesario.
4. Crear migración correctiva.

## Buenas prácticas

- No editar migraciones ya aplicadas.
- No correr `migrate dev` en producción.
- Usar `migrate deploy` para staging/producción.
- Mantener backups automáticos activos.
