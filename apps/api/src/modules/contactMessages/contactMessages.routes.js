import { Router } from 'express';
import { contactMessagesController } from './contactMessages.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.post('/public', asyncHandler(contactMessagesController.publicCreate));

router.use(requireAuth);
router.get('/', requirePermission(MODULES.messages, ACTIONS.read), asyncHandler(contactMessagesController.list));
router.get('/unread-count', requirePermission(MODULES.messages, ACTIONS.read), asyncHandler(contactMessagesController.unreadCount));
router.get('/:id', requirePermission(MODULES.messages, ACTIONS.read), asyncHandler(contactMessagesController.detail));
router.patch('/:id/read', requirePermission(MODULES.messages, ACTIONS.update), asyncHandler(contactMessagesController.markAsRead));
router.patch('/:id/status', requirePermission(MODULES.messages, ACTIONS.update), asyncHandler(contactMessagesController.updateStatus));
router.post('/:id/convert-to-client', requirePermission(MODULES.messages, ACTIONS.create), asyncHandler(contactMessagesController.convertToClient));
router.delete('/:id', requirePermission(MODULES.messages, ACTIONS.delete), asyncHandler(contactMessagesController.remove));

export default router;
