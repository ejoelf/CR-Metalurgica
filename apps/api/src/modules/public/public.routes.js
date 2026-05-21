import { Router } from 'express';
import { publicController } from './public.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

const router = Router();

router.get('/branding', asyncHandler(publicController.getBranding));
router.get('/quotes/:token/download', asyncHandler(publicController.downloadQuotePdf));

export default router;