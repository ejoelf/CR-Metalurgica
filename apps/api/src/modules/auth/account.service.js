import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { badRequest, unauthorized } from '../../utils/ApiError.js';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username || user.name,
    email: user.email,
    role: user.role?.name || user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

export const accountService = {
  async updateProfile(userId, payload) {
    const username = String(payload.username || payload.name || '').trim();

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: payload.email,
        NOT: { id: userId },
      },
    });

    if (existingEmail) {
      throw badRequest('El email ya está siendo usado por otro usuario');
    }

    const existingUsername = username
      ? await prisma.user.findFirst({
          where: {
            username,
            NOT: { id: userId },
          },
        })
      : null;

    if (existingUsername) {
      throw badRequest('El usuario ya está siendo usado por otro usuario');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name,
        username,
        email: payload.email,
      },
      include: { role: true },
    });

    return sanitizeUser(user);
  },

  async changePassword(userId, payload) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw unauthorized('Usuario no encontrado');
    }

    const passwordOk = await bcrypt.compare(payload.currentPassword, user.passwordHash);

    if (!passwordOk) {
      throw unauthorized('La contraseña actual no es correcta');
    }

    const samePassword = await bcrypt.compare(payload.newPassword, user.passwordHash);

    if (samePassword) {
      throw badRequest('La nueva contraseña debe ser distinta a la actual');
    }

    const passwordHash = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { ok: true, message: 'Contraseña actualizada correctamente. Volvé a iniciar sesión.' };
  },
};
