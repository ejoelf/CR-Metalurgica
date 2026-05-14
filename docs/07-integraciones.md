# Bloque 6 — Integraciones PDF, WhatsApp, Email e IA

## Objetivo

Agregar la capa de integraciones de CF Metal Pintura PRO sin ejecutar envíos reales todavía, dejando servicios desacoplados, logs y endpoints preparados.

## Ubicación

```txt
apps/api/src/integrations/
```

## Estructura creada

```txt
apps/api/src/integrations/
├── README.md
├── pdf/
│   ├── pdf.service.js
│   ├── pdfStorage.service.js
│   └── quotePdfTemplate.js
├── whatsapp/
│   ├── whatsapp.logger.js
│   ├── whatsapp.service.js
│   └── whatsapp.templates.js
├── email/
│   ├── email.providers.js
│   ├── email.service.js
│   └── email.templates.js
└── ai/
    ├── ai.commercialText.js
    ├── ai.materialEstimator.js
    ├── ai.quoteSuggestions.js
    └── ai.service.js
```

## PDF

### Función principal

```js
generateQuotePdf(quoteId)
```

### Capacidades

- Genera presupuesto en PDF.
- Incluye datos del negocio.
- Incluye datos del cliente.
- Incluye ítems, costos y total.
- Guarda archivo localmente.
- Registra `PdfDocument` en base de datos.
- Actualiza `quote.pdfUrl`.
- Genera token público seguro.

### Endpoint

```txt
POST /api/integrations/quotes/:quoteId/pdf
GET  /api/public/quotes/:token/download
```

## WhatsApp

### Función principal

```js
sendWhatsAppMessage(payload)
```

### Capacidades

- No envía mensajes reales todavía.
- Prepara payload estándar.
- Usa plantillas.
- Registra log en `MessageLog`.
- Queda listo para Meta WhatsApp Business Cloud API.

### Endpoints

```txt
POST /api/integrations/quotes/:quoteId/whatsapp
POST /api/integrations/whatsapp/send
```

## Email

### Función principal

```js
sendEmail(payload)
```

### Capacidades

- Modo mock por defecto.
- SMTP preparado con Nodemailer.
- Plantillas HTML.
- Envío de presupuestos preparado.
- Logs en `MessageLog`.

### Endpoints

```txt
POST /api/integrations/quotes/:quoteId/email
POST /api/integrations/email/send
```

## IA

### Servicios

```js
ai.generateQuoteSuggestions()
ai.generateCommercialText()
ai.generateMaterialSuggestions()
ai.analyzeJob()
```

### Capacidades

- Sugerencias de presupuestos.
- Textos comerciales.
- Sugerencias de materiales.
- Análisis básico de trabajos.
- Persistencia en `AiSuggestion`.
- Preparado para integrar proveedores reales en el futuro.

### Endpoints

```txt
POST /api/integrations/ai/quote-suggestions
POST /api/integrations/ai/commercial-text
POST /api/integrations/ai/material-suggestions
POST /api/integrations/ai/analyze-job
```

## Variables de entorno

```env
PDF_STORAGE_PATH="storage/pdfs"
EMAIL_PROVIDER="mock"
EMAIL_FROM="CF Metal Pintura <no-reply@cfmetalpintura.com>"
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
WHATSAPP_PROVIDER="mock"
WHATSAPP_BUSINESS_PHONE="5493585719450"
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_API_TOKEN=""
AI_PROVIDER="mock"
AI_API_KEY=""
```

## Seguridad

- No se guardan tokens reales en el repo.
- Los envíos externos quedan en mock hasta configurar proveedor.
- Los PDFs usan token público único.
- Los logs se persisten en base de datos.
- Las rutas de integración son privadas salvo descarga pública del PDF por token.

## Estado

Bloque 6 completado. Las integraciones quedan preparadas y conectadas al backend.
