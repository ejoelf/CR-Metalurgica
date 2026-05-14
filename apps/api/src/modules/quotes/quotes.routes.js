import { Router } from 'express';
import { quotesController } from './quotes.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(quotesController.list));
router.get('/:id', asyncHandler(quotesController.detail));
router.post('/', asyncHandler(quotesController.create));
router.put('/:id', asyncHandler(quotesController.update));
router.patch('/:id/status', asyncHandler(quotesController.updateStatus));
router.post('/:id/items', asyncHandler(quotesController.addItem));
router.put('/:id/items/:itemId', asyncHandler(quotesController.updateItem));
router.delete('/:id/items/:itemId', asyncHandler(quotesController.deleteItem));
router.get('/:id/pdf', asyncHandler(quotesController.pdfPlaceholder));
router.post('/:id/send', asyncHandler(quotesController.sendPlaceholder));
router.delete('/:id', asyncHandler(quotesController.remove));

export default router;
