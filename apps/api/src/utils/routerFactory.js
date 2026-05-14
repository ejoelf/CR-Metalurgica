import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export function createCrudRouter(controller, options = {}) {
  const router = Router();
  const isPublicCreate = options.publicCreate || false;

  if (!isPublicCreate) {
    router.use(requireAuth);
  }

  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.detail));
  router.post('/', asyncHandler(controller.create));
  router.put('/:id', asyncHandler(controller.update));
  router.delete('/:id', asyncHandler(controller.remove));

  return router;
}
