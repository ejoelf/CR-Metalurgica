import { Router } from 'express';
import { contactMessagesController } from './contactMessages.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/public', asyncHandler(contactMessagesController.publicCreate));

router.use(requireAuth);
router.get('/', asyncHandler(contactMessagesController.list));
router.get('/:id', asyncHandler(contactMessagesController.detail));
router.patch('/:id/status', asyncHandler(contactMessagesController.updateStatus));
router.post('/:id/convert-to-client', asyncHandler(contactMessagesController.convertToClient));
router.delete('/:id', asyncHandler(contactMessagesController.remove));

export default router;
