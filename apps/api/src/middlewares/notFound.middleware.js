import { notFound } from '../utils/ApiError.js';

export function notFoundHandler(req, res, next) {
  next(notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}
