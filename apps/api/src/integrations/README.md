# Integraciones — CF Metal Pintura PRO

Capa de integraciones externas y automatizaciones del backend.

## Incluye

```txt
integrations/
├── pdf/
├── whatsapp/
├── email/
└── ai/
```

## Principios

- Servicios desacoplados.
- Proveedores externos reemplazables.
- Logs persistidos en base de datos.
- Modo mock por defecto para WhatsApp, Email e IA.
- PDF local preparado para migrar a storage externo.

## Endpoints

```txt
POST /api/integrations/quotes/:quoteId/pdf
POST /api/integrations/quotes/:quoteId/whatsapp
POST /api/integrations/quotes/:quoteId/email
POST /api/integrations/whatsapp/send
POST /api/integrations/email/send
POST /api/integrations/ai/quote-suggestions
POST /api/integrations/ai/commercial-text
POST /api/integrations/ai/material-suggestions
POST /api/integrations/ai/analyze-job
GET  /api/public/quotes/:token/download
```
