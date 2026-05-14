import { forbidden } from '../utils/ApiError.js';

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(forbidden('Usuario no autenticado'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(forbidden('No tenes permisos para realizar esta accion'));
    }

    return next();
  };
}
