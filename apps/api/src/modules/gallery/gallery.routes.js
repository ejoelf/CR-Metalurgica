import { Router } from 'express';
import { galleryController } from './gallery.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.get('/public', asyncHandler(galleryController.publicList));

router.use(requireAuth);
router.get('/', requirePermission(MODULES.gallery, ACTIONS.read), asyncHandler(galleryController.list));
router.get('/:id', requirePermission(MODULES.gallery, ACTIONS.read), asyncHandler(galleryController.detail));
router.post('/', requirePermission(MODULES.gallery, ACTIONS.create), asyncHandler(galleryController.create));
router.put('/:id', requirePermission(MODULES.gallery, ACTIONS.update), asyncHandler(galleryController.update));
router.patch('/:id/published', requirePermission(MODULES.gallery, ACTIONS.update), asyncHandler(galleryController.togglePublished));
router.patch('/:id/featured', requirePermission(MODULES.gallery, ACTIONS.update), asyncHandler(galleryController.toggleFeatured));
router.delete('/:id', requirePermission(MODULES.gallery, ACTIONS.delete), asyncHandler(galleryController.remove));

export default router;
