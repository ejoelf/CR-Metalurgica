import { Router } from 'express';
import { incomesController } from './incomes.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(incomesController.list));
router.get('/:id', asyncHandler(incomesController.detail));
router.post('/', asyncHandler(incomesController.create));
router.put('/:id', asyncHandler(incomesController.update));
router.patch('/:id/status', asyncHandler(incomesController.updateStatus));
router.delete('/:id', asyncHandler(incomesController.remove));

export default router;
