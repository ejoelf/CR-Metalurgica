import { Router } from 'express';
import { clientsController } from './clients.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission(MODULES.clients, ACTIONS.read), asyncHandler(clientsController.list));
router.get('/:id', requirePermission(MODULES.clients, ACTIONS.read), asyncHandler(clientsController.detail));
router.post('/', requirePermission(MODULES.clients, ACTIONS.create), asyncHandler(clientsController.create));
router.put('/:id', requirePermission(MODULES.clients, ACTIONS.update), asyncHandler(clientsController.update));
router.delete('/:id', requirePermission(MODULES.clients, ACTIONS.delete), asyncHandler(clientsController.remove));

export default router;
