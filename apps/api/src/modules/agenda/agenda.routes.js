import { Router } from 'express';
import { agendaController } from './agenda.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(agendaController.list));
router.get('/:id', asyncHandler(agendaController.detail));
router.post('/', asyncHandler(agendaController.create));
router.put('/:id', asyncHandler(agendaController.update));
router.patch('/:id/status', asyncHandler(agendaController.updateStatus));
router.delete('/:id', asyncHandler(agendaController.remove));

export default router;
