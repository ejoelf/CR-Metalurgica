import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(notificationsController.list));
router.patch('/read-all', asyncHandler(notificationsController.markAllAsRead));
router.get('/:id', asyncHandler(notificationsController.detail));
router.patch('/:id/read', asyncHandler(notificationsController.markAsRead));
router.delete('/:id', asyncHandler(notificationsController.remove));

export default router;
