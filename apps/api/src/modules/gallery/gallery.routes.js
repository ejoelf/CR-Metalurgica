import { Router } from 'express';
import { galleryController } from './gallery.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/public', asyncHandler(galleryController.publicList));

router.use(requireAuth);
router.get('/', asyncHandler(galleryController.list));
router.get('/:id', asyncHandler(galleryController.detail));
router.post('/', asyncHandler(galleryController.create));
router.put('/:id', asyncHandler(galleryController.update));
router.delete('/:id', asyncHandler(galleryController.remove));

export default router;
