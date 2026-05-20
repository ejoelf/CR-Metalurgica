import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';
import { auditController } from './audit.controller.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['super_admin']));
router.get('/', requirePermission(MODULES.audit, ACTIONS.read), asyncHandler(auditController.list));
router.get('/:id', requirePermission(MODULES.audit, ACTIONS.read), asyncHandler(auditController.detail));

export default router;
