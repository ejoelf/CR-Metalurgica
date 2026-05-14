import { Router } from 'express';
import { rolesController } from './roles.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/roles.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireRoles('super_admin', 'admin'));

router.get('/', asyncHandler(rolesController.list));
router.get('/:id', asyncHandler(rolesController.detail));
router.post('/', asyncHandler(rolesController.create));
router.put('/:id', asyncHandler(rolesController.update));
router.delete('/:id', asyncHandler(rolesController.remove));

export default router;
