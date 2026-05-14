import { createCrudService } from '../../utils/crudFactory.js';

export const rolesService = createCrudService('role', {
  orderBy: { name: 'asc' },
});
