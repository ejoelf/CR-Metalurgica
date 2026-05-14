import { prisma } from '../config/prisma.js';
import { notFound } from './ApiError.js';

export function createCrudService(modelName, options = {}) {
  const model = prisma[modelName];

  if (!model) {
    throw new Error(`Modelo Prisma no encontrado: ${modelName}`);
  }

  const defaultInclude = options.include || undefined;
  const defaultOrderBy = options.orderBy || { createdAt: 'desc' };

  return {
    async findMany({ query = {} } = {}) {
      const take = Math.min(Number(query.limit || 50), 100);
      const skip = Number(query.skip || 0);

      return model.findMany({
        take,
        skip,
        orderBy: defaultOrderBy,
        include: defaultInclude,
      });
    },

    async findById(id) {
      const item = await model.findUnique({
        where: { id },
        include: defaultInclude,
      });

      if (!item) {
        throw notFound('Registro no encontrado');
      }

      return item;
    },

    async create(data) {
      return model.create({
        data,
        include: defaultInclude,
      });
    },

    async update(id, data) {
      await this.findById(id);
      return model.update({
        where: { id },
        data,
        include: defaultInclude,
      });
    },

    async remove(id) {
      await this.findById(id);
      return model.delete({ where: { id } });
    },
  };
}
