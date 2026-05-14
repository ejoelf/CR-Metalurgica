import { ApiError } from '../utils/ApiError.js';

export function errorHandler(error, req, res, next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const code = error instanceof ApiError ? error.code : 'INTERNAL_ERROR';
  const message = error instanceof ApiError ? error.message : 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: code,
    details: error.details || null,
  });
}
