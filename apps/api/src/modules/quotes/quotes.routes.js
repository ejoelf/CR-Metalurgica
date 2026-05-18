import { Router } from 'express';
import { quotesController } from './quotes.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission(MODULES.quotes, ACTIONS.read), asyncHandler(quotesController.list));
router.get('/:id', requirePermission(MODULES.quotes, ACTIONS.read), asyncHandler(quotesController.detail));
router.post('/', requirePermission(MODULES.quotes, ACTIONS.create), asyncHandler(quotesController.create));
router.put('/:id', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.update));
router.patch('/:id/status', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.updateStatus));
router.post('/:id/items', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.addItem));
router.put('/:id/items/:itemId', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.updateItem));
router.delete('/:id/items/:itemId', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.deleteItem));
router.get('/:id/pdf', requirePermission(MODULES.quotes, ACTIONS.export), asyncHandler(quotesController.pdfPlaceholder));
router.post('/:id/send', requirePermission(MODULES.quotes, ACTIONS.update), asyncHandler(quotesController.sendPlaceholder));
router.delete('/:id', requirePermission(MODULES.quotes, ACTIONS.delete), asyncHandler(quotesController.remove));

export default router;
