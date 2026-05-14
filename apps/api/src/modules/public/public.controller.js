import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';

export const publicController = {
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
