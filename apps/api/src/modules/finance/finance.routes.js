import { Router } from 'express';
import { financeController } from './finance.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middlewares/auth.middleware.js';
import { MODULES, ACTIONS } from '../../config/permissions.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.summary));
router.get('/monthly', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.monthly));
router.get('/movements', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.movements));
router.get('/movements/:type/:id', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.movementDetail));
router.post('/movements', requirePermission(MODULES.finances, ACTIONS.create), asyncHandler(financeController.createMovement));
router.put('/movements/:type/:id', requirePermission(MODULES.finances, ACTIONS.update), asyncHandler(financeController.updateMovement));
router.delete('/movements/:type/:id', requirePermission(MODULES.finances, ACTIONS.delete), asyncHandler(financeController.deleteMovement));
router.get('/by-job/:jobId', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.byJob));
router.get('/profitability', requirePermission(MODULES.finances, ACTIONS.read), asyncHandler(financeController.profitability));

export default router;
