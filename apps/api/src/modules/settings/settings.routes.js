import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import { accountController } from '../account/account.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/roles.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../auth/auth.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/business', asyncHandler(settingsController.getBusinessSettings));
router.put('/business', requireRoles('super_admin', 'admin'), asyncHandler(settingsController.updateBusinessSettings));
router.put('/profile', validate(updateProfileSchema), asyncHandler(accountController.updateProfile));
router.put('/password', validate(changePasswordSchema), asyncHandler(accountController.changePassword));

export default router;
