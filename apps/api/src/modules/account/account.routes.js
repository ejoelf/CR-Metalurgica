import { Router } from 'express';
import { accountController } from './account.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../auth/auth.validation.js';

const router = Router();

router.use(requireAuth);

router.put('/profile', validate(updateProfileSchema), asyncHandler(accountController.updateProfile));
router.put('/password', validate(changePasswordSchema), asyncHandler(accountController.changePassword));

export default router;
