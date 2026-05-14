import { Router } from 'express';
import { integrationsController } from './integrations.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/quotes/:quoteId/pdf', asyncHandler(integrationsController.generateQuotePdf));
router.post('/quotes/:quoteId/whatsapp', asyncHandler(integrationsController.sendQuoteWhatsApp));
router.post('/quotes/:quoteId/email', asyncHandler(integrationsController.sendQuoteEmail));

router.post('/whatsapp/send', asyncHandler(integrationsController.sendWhatsApp));
router.post('/email/send', asyncHandler(integrationsController.sendEmail));

router.post('/ai/quote-suggestions', asyncHandler(integrationsController.aiQuoteSuggestions));
router.post('/ai/commercial-text', asyncHandler(integrationsController.aiCommercialText));
router.post('/ai/material-suggestions', asyncHandler(integrationsController.aiMaterialSuggestions));
router.post('/ai/analyze-job', asyncHandler(integrationsController.aiAnalyzeJob));

export default router;
