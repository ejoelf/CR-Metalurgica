import { expensesController } from './expenses.controller.js';
import { createCrudRouter } from '../../utils/routerFactory.js';

export default createCrudRouter(expensesController);
