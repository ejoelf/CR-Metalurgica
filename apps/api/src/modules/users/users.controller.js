import { usersService } from './users.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';

export const usersController = createCrudController(usersService, 'Usuario');
