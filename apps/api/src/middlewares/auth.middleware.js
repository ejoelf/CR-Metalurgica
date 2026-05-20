import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../utils/ApiError.js';
import { can } from '../config/permissions.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw unauthorized('Token requerido');
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw unauthorized('Usuario no autorizado');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
    };

    next();
  } catch (error) {
    next(unauthorized('Sesion invalida o expirada'));
  }
}

export function requirePermission(moduleName, action) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !can(role, moduleName, action)) {
      return next(forbidden('No tenés permisos para realizar esta acción'));
    }

    return next();
  };
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return next(forbidden('No tenés permisos para acceder a esta sección'));
    }

    return next();
  };
}
