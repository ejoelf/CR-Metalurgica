import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission(MODULES.notifications, ACTIONS.read), asyncHandler(notificationsController.list));
router.get('/unread-count', requirePermission(MODULES.notifications, ACTIONS.read), asyncHandler(notificationsController.unreadCount));
router.patch('/read-all', requirePermission(MODULES.notifications, ACTIONS.update), asyncHandler(notificationsController.markAllAsRead));
router.get('/:id', requirePermission(MODULES.notifications, ACTIONS.read), asyncHandler(notificationsController.detail));
router.patch('/:id/read', requirePermission(MODULES.notifications, ACTIONS.update), asyncHandler(notificationsController.markAsRead));
router.delete('/:id', requirePermission(MODULES.notifications, ACTIONS.delete), asyncHandler(notificationsController.remove));

export default router;
