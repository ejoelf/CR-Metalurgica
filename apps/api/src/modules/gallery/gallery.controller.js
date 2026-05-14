import { galleryService } from './gallery.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(galleryService, 'Item de galeria');

export const galleryController = {
  ...baseController,

  async publicList(req, res) {
    const items = await galleryService.findMany({ query: req.query });
    const data = items.filter((item) => item.isPublished);
    return sendSuccess(res, data, 'Galeria publica obtenida');
  },
};
