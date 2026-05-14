import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/responses.js';
import { generateQuotePdf } from '../../integrations/pdf/pdf.service.js';
import { sendQuoteWhatsApp, sendWhatsAppMessage } from '../../integrations/whatsapp/whatsapp.service.js';
import { sendEmail, sendQuoteEmail } from '../../integrations/email/email.service.js';
import { quoteEmailTemplate } from '../../integrations/email/email.templates.js';
import { ai } from '../../integrations/ai/ai.service.js';

export const integrationsController = {
  async generateQuotePdf(req, res) {
    const data = await generateQuotePdf(req.params.quoteId);
    return sendSuccess(res, data, 'PDF de presupuesto generado correctamente');
  },

  async sendQuoteWhatsApp(req, res) {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.quoteId },
      include: { client: true },
    });

    if (!quote) throw notFound('Presupuesto no encontrado');

    const to = req.body.to || quote.client?.phone;
    const quoteUrl = req.body.quoteUrl || quote.pdfUrl || '';

    const data = await sendQuoteWhatsApp({
      to,
      quote,
      quoteUrl,
      clientName: quote.client?.fullName,
    });

    return sendSuccess(res, data, 'WhatsApp de presupuesto preparado correctamente');
  },

  async sendWhatsApp(req, res) {
    const data = await sendWhatsAppMessage(req.body);
    return sendSuccess(res, data, 'WhatsApp preparado correctamente');
  },

  async sendQuoteEmail(req, res) {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.quoteId },
      include: { client: true },
    });

    if (!quote) throw notFound('Presupuesto no encontrado');

    const to = req.body.to || quote.client?.email;
    const quoteUrl = req.body.quoteUrl || quote.pdfUrl || '';
    const html = quoteEmailTemplate({
      clientName: quote.client?.fullName,
      quoteNumber: quote.quoteNumber,
      quoteUrl,
    });

    const data = await sendQuoteEmail({
      to,
      clientName: quote.client?.fullName,
      quoteNumber: quote.quoteNumber,
      quoteUrl,
      html,
    });

    return sendSuccess(res, data, 'Email de presupuesto preparado correctamente');
  },

  async sendEmail(req, res) {
    const data = await sendEmail(req.body);
    return sendSuccess(res, data, 'Email preparado correctamente');
  },

  async aiQuoteSuggestions(req, res) {
    const data = await ai.generateQuoteSuggestions(req.body);
    return sendSuccess(res, data, 'Sugerencias de presupuesto generadas');
  },

  async aiCommercialText(req, res) {
    const data = await ai.generateCommercialText(req.body);
    return sendSuccess(res, data, 'Texto comercial generado');
  },

  async aiMaterialSuggestions(req, res) {
    const data = await ai.generateMaterialSuggestions(req.body);
    return sendSuccess(res, data, 'Sugerencias de materiales generadas');
  },

  async aiAnalyzeJob(req, res) {
    const data = await ai.analyzeJob(req.body);
    return sendSuccess(res, data, 'Analisis de trabajo generado');
  },
};
