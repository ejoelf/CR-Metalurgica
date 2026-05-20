import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { crmController } from './crm.controller.js';

const router = Router();

router.get('/dashboard', requireAuth, asyncHandler(crmController.dashboard));
router.get('/sidebar-counts', requireAuth, asyncHandler(crmController.sidebarCounts));

export default router;
