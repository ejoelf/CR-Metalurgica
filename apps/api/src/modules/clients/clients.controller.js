import { clientsService } from './clients.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';

export const clientsController = createCrudController(clientsService, 'Cliente');
