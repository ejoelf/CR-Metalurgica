import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { badRequest, unauthorized } from '../../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/token.js';

export const authService = {
  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw unauthorized('Credenciales invalidas');
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
      throw unauthorized('Credenciales invalidas');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw badRequest('Refresh token requerido');
    }

    const payload = verifyRefreshToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.userId !== payload.sub) {
      throw unauthorized('Refresh token invalido');
    }

    if (storedToken.expiresAt < new Date()) {
      throw unauthorized('Refresh token expirado');
    }

    return {
      accessToken: signAccessToken(storedToken.user),
      user: this.sanitizeUser(storedToken.user),
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) return { ok: true };

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { ok: true };
  },

  async me(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw unauthorized('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  },

  sanitizeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  },
};
