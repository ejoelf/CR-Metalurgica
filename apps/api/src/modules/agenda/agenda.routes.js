import { Router } from 'express';
import { agendaController } from './agenda.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission(MODULES.agenda, ACTIONS.read), asyncHandler(agendaController.list));
router.get('/today', requirePermission(MODULES.agenda, ACTIONS.read), asyncHandler(agendaController.today));
router.get('/:id', requirePermission(MODULES.agenda, ACTIONS.read), asyncHandler(agendaController.detail));
router.post('/', requirePermission(MODULES.agenda, ACTIONS.create), asyncHandler(agendaController.create));
router.put('/:id', requirePermission(MODULES.agenda, ACTIONS.update), asyncHandler(agendaController.update));
router.patch('/:id/status', requirePermission(MODULES.agenda, ACTIONS.update), asyncHandler(agendaController.updateStatus));
router.delete('/:id', requirePermission(MODULES.agenda, ACTIONS.delete), asyncHandler(agendaController.remove));

export default router;
