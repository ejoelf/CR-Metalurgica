import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';

export const usersService = {
  async findMany() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { role: true },
    });
  },

  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) throw notFound('Usuario no encontrado');
    return user;
  },

  async create(data) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        roleId: data.roleId,
        isActive: data.isActive ?? true,
      },
      include: { role: true },
    });
  },

  async update(id, data) {
    await this.findById(id);

    const updateData = { ...data };
    delete updateData.password;

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
