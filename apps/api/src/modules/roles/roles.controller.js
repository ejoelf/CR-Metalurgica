import { rolesService } from './roles.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';

export const rolesController = createCrudController(rolesService, 'Rol');
