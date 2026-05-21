import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';
import { settingsService } from '../settings/settings.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const publicController = {
  async getBranding(req, res) {
    const data = await settingsService.getPublicBranding();
    return sendSuccess(res, data, 'Branding publico obtenido');
  },

  async downloadQuotePdf(req, res) {
    const document = await prisma.pdfDocument.findUnique({
      where: { token: req.params.token },
    });

    if (!document) {
      throw notFound('Documento no encontrado');
    }

    return res.download(document.filePath, document.fileName);
  },
};