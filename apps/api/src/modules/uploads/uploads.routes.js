import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { uploadsController } from './uploads.controller.js';

const router = Router();

router.use(requireAuth);
router.post('/image', asyncHandler(uploadsController.image));

export default router;
