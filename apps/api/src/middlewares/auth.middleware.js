import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { unauthorized } from '../utils/ApiError.js';

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
