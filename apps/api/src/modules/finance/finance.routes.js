import { Router } from 'express';
import { financeController } from './finance.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', asyncHandler(financeController.summary));
router.get('/monthly', asyncHandler(financeController.monthly));
router.get('/by-job/:jobId', asyncHandler(financeController.byJob));
router.get('/profitability', asyncHandler(financeController.profitability));

export default router;
