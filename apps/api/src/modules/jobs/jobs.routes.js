import { Router } from 'express';
import { jobsController } from './jobs.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission(MODULES.jobs, ACTIONS.read), asyncHandler(jobsController.list));
router.get('/:id', requirePermission(MODULES.jobs, ACTIONS.read), asyncHandler(jobsController.detail));
router.get('/:id/timeline', requirePermission(MODULES.jobs, ACTIONS.read), asyncHandler(jobsController.timeline));
router.post('/', requirePermission(MODULES.jobs, ACTIONS.create), asyncHandler(jobsController.create));
router.put('/:id', requirePermission(MODULES.jobs, ACTIONS.update), asyncHandler(jobsController.update));
router.patch('/:id/status', requirePermission(MODULES.jobs, ACTIONS.update), asyncHandler(jobsController.updateStatus));
router.delete('/:id', requirePermission(MODULES.jobs, ACTIONS.delete), asyncHandler(jobsController.remove));

export default router;
