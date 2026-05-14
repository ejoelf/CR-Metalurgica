import { Router } from 'express';
import { usersController } from './users.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/roles.middleware.js';
import { createUserSchema, updateUserSchema } from './users.validation.js';

const router = Router();

router.use(requireAuth);
router.use(requireRoles('super_admin', 'admin'));

router.get('/', asyncHandler(usersController.list));
router.get('/:id', asyncHandler(usersController.detail));
router.post('/', validate(createUserSchema), asyncHandler(usersController.create));
router.put('/:id', validate(updateUserSchema), asyncHandler(usersController.update));
router.delete('/:id', asyncHandler(usersController.remove));

export default router;
