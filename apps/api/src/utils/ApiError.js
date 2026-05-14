export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message = 'Solicitud inválida', details = null) {
  return new ApiError(message, 400, 'BAD_REQUEST', details);
}

export function unauthorized(message = 'No autorizado') {
  return new ApiError(message, 401, 'UNAUTHORIZED');
}

export function forbidden(message = 'Permisos insuficientes') {
  return new ApiError(message, 403, 'FORBIDDEN');
}

export function notFound(message = 'Recurso no encontrado') {
  return new ApiError(message, 404, 'NOT_FOUND');
}
