import { Router } from 'express';
import { jobsController } from './jobs.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(jobsController.list));
router.get('/:id', asyncHandler(jobsController.detail));
router.get('/:id/timeline', asyncHandler(jobsController.timeline));
router.post('/', asyncHandler(jobsController.create));
router.put('/:id', asyncHandler(jobsController.update));
router.patch('/:id/status', asyncHandler(jobsController.updateStatus));
router.delete('/:id', asyncHandler(jobsController.remove));

export default router;
