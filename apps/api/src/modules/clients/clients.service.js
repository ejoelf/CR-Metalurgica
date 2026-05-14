import { createCrudService } from '../../utils/crudFactory.js';

export const clientsService = createCrudService('client', {
  include: {
    jobs: true,
    quotes: true,
  },
});
