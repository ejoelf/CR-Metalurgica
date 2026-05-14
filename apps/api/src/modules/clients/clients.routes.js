import { clientsController } from './clients.controller.js';
import { createCrudRouter } from '../../utils/routerFactory.js';

export default createCrudRouter(clientsController);
