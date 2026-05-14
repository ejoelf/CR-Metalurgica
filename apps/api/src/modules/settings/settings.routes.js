import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/roles.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/business', asyncHandler(settingsController.getBusinessSettings));
router.put('/business', requireRoles('super_admin', 'admin'), asyncHandler(settingsController.updateBusinessSettings));

export default router;
