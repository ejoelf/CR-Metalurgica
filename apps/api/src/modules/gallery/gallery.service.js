import { createCrudService } from '../../utils/crudFactory.js';

export const galleryService = createCrudService('galleryItem', {
  orderBy: { sortOrder: 'asc' },
});
