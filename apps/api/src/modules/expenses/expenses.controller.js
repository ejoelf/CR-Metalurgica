import { expensesService } from './expenses.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';

export const expensesController = createCrudController(expensesService, 'Egreso');
