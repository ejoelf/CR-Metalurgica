import { uploadsService } from './uploads.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const uploadsController = {
  async image(req, res) {
    const data = await uploadsService.uploadImage(req.body);
    return sendSuccess(res, data, 'Imagen cargada correctamente', 201);
  },
};
