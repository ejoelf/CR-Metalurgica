import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';

function getMonthRange(query = {}) {
  const now = new Date();
  const year = Number(query.year || now.getFullYear());
  const month = Number(query.month || now.getMonth() + 1);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end, year, month };
}

function getDateRange(query = {}) {
  if (query.date) {
    const start = new Date(`${query.date}T00:00:00`);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return { start, end };
  }
  return getMonthRange(query);
}

function blockFutureDate(value) {
  if (!value) return;
  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) throw badRequest('No se pueden registrar movimientos financieros con fecha futura');
}

function normalizeType(type) {
  if (type === 'income' || type === 'ingreso') return 'income';
  if (type === 'expense' || type === 'egreso') return 'expense';
  throw badRequest('Tipo de movimiento inválido');
}

function mapIncome(item) {
  return {
    ...item,
    movementType: 'income',
    movementDate: item.paidAt || item.createdAt,
  };
}

function mapExpense(item) {
  return {
    ...item,
    movementType: 'expense',
    movementDate: item.expenseDate || item.createdAt,
  };
}

async function cancelRelatedFinanceAgenda({ type, id }) {
  const where = type === 'income'
    ? { entityType: 'income', entityId: id }
    : { entityType: 'expense', entityId: id };

  await prisma.notification.deleteMany({ where });
}

export const financeService = {
  async summary(query) {
    const { start, end, year, month } = getMonthRange(query);

    const [paidIncomes, pendingIncomes, expenses] = await Promise.all([
      prisma.income.aggregate({
        where: { status: 'paid', paidAt: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.income.aggregate({
        where: { status: 'pending', createdAt: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: { expenseDate: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalIncome = Number(paidIncomes._sum.amount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);

    return {
      year,
      month,
      totalIncome,
      pendingIncome: Number(pendingIncomes._sum.amount || 0),
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeCount: paidIncomes._count,
      pendingIncomeCount: pendingIncomes._count,
      expenseCount: expenses._count,
    };
  },

  async monthly(query) {
    return this.summary(query);
  },

  async movements(query = {}) {
    const { start, end } = getDateRange(query);
    const type = query.type ? normalizeType(query.type) : null;

    const [incomes, expenses] = await Promise.all([
      type === 'expense'
        ? []
        : prisma.income.findMany({
            where: {
              status: { not: 'cancelled' },
              OR: [
                { paidAt: { gte: start, lt: end } },
                { paidAt: null, createdAt: { gte: start, lt: end } },
              ],
              ...(query.clientId ? { clientId: query.clientId } : {}),
              ...(query.jobId ? { jobId: query.jobId } : {}),
              ...(query.quoteId ? { quoteId: query.quoteId } : {}),
            },
            include: { client: true, job: true, quote: true },
            orderBy: { createdAt: 'desc' },
          }),
      type === 'income'
        ? []
        : prisma.expense.findMany({
            where: {
              expenseDate: { gte: start, lt: end },
              ...(query.clientId ? { clientId: query.clientId } : {}),
              ...(query.jobId ? { jobId: query.jobId } : {}),
              ...(query.quoteId ? { quoteId: query.quoteId } : {}),
            },
            include: { client: true, job: true, quote: true },
            orderBy: { expenseDate: 'desc' },
          }),
    ]);

    return [...incomes.map(mapIncome), ...expenses.map(mapExpense)].sort((a, b) => new Date(b.movementDate) - new Date(a.movementDate));
  },

  async movementDetail(type, id) {
    const movementType = normalizeType(type);
    if (movementType === 'income') {
      const item = await prisma.income.findFirst({ where: { id, status: { not: 'cancelled' } }, include: { client: true, job: true, quote: true } });
      if (!item) throw notFound('Ingreso no encontrado');
      return mapIncome(item);
    }

    const item = await prisma.expense.findUnique({ where: { id }, include: { client: true, job: true, quote: true } });
    if (!item) throw notFound('Egreso no encontrado');
    return mapExpense(item);
  },

  async createMovement(data = {}, user = null) {
    const type = normalizeType(data.type || data.movementType);
    const amount = Number(data.amount || 0);
    if (amount <= 0) throw badRequest('El monto debe ser mayor a cero');
    if (!data.title) throw badRequest('El título del movimiento es requerido');

    if (type === 'income') {
      const paidAt = data.paidAt || data.movementDate || new Date();
      blockFutureDate(paidAt);
      return mapIncome(await prisma.income.create({
        data: {
          title: String(data.title).trim(),
          description: data.description ? String(data.description).trim() : null,
          amount,
          status: data.status || 'paid',
          paymentMethod: data.paymentMethod || null,
          paidAt: new Date(paidAt),
          clientId: data.clientId || null,
          jobId: data.jobId || null,
          quoteId: data.quoteId || null,
          createdById: user?.id || null,
        },
        include: { client: true, job: true, quote: true },
      }));
    }

    const expenseDate = data.expenseDate || data.movementDate || new Date();
    blockFutureDate(expenseDate);
    return mapExpense(await prisma.expense.create({
      data: {
        title: String(data.title).trim(),
        description: data.description ? String(data.description).trim() : null,
        amount,
        category: data.category || 'general',
        paymentMethod: data.paymentMethod || null,
        expenseDate: new Date(expenseDate),
        supplierName: data.supplierName || null,
        clientId: data.clientId || null,
        jobId: data.jobId || null,
        quoteId: data.quoteId || null,
        createdById: user?.id || null,
      },
      include: { client: true, job: true, quote: true },
    }));
  },

  async updateMovement(type, id, data = {}) {
    const movementType = normalizeType(type);
    const amount = data.amount !== undefined ? Number(data.amount || 0) : undefined;
    if (amount !== undefined && amount <= 0) throw badRequest('El monto debe ser mayor a cero');

    if (movementType === 'income') {
      await this.movementDetail('income', id);
      const paidAt = data.paidAt || data.movementDate;
      blockFutureDate(paidAt);
      return mapIncome(await prisma.income.update({
        where: { id },
        data: {
          title: data.title !== undefined ? String(data.title).trim() : undefined,
          description: data.description !== undefined ? String(data.description || '').trim() || null : undefined,
          amount,
          status: data.status,
          paymentMethod: data.paymentMethod,
          paidAt: paidAt ? new Date(paidAt) : undefined,
          clientId: data.clientId !== undefined ? data.clientId || null : undefined,
          jobId: data.jobId !== undefined ? data.jobId || null : undefined,
          quoteId: data.quoteId !== undefined ? data.quoteId || null : undefined,
        },
        include: { client: true, job: true, quote: true },
      }));
    }

    await this.movementDetail('expense', id);
    const expenseDate = data.expenseDate || data.movementDate;
    blockFutureDate(expenseDate);
    return mapExpense(await prisma.expense.update({
      where: { id },
      data: {
        title: data.title !== undefined ? String(data.title).trim() : undefined,
        description: data.description !== undefined ? String(data.description || '').trim() || null : undefined,
        amount,
        category: data.category,
        paymentMethod: data.paymentMethod,
        expenseDate: expenseDate ? new Date(expenseDate) : undefined,
        supplierName: data.supplierName !== undefined ? data.supplierName || null : undefined,
        clientId: data.clientId !== undefined ? data.clientId || null : undefined,
        jobId: data.jobId !== undefined ? data.jobId || null : undefined,
        quoteId: data.quoteId !== undefined ? data.quoteId || null : undefined,
      },
      include: { client: true, job: true, quote: true },
    }));
  },

  async deleteMovement(type, id) {
    const movementType = normalizeType(type);
    if (movementType === 'income') {
      await this.movementDetail('income', id);
      const deleted = await prisma.income.delete({ where: { id }, include: { client: true, job: true, quote: true } });
      await cancelRelatedFinanceAgenda({ type: 'income', id });
      return mapIncome(deleted);
    }

    await this.movementDetail('expense', id);
    const deleted = await prisma.expense.delete({ where: { id }, include: { client: true, job: true, quote: true } });
    await cancelRelatedFinanceAgenda({ type: 'expense', id });
    return mapExpense(deleted);
  },

  async byJob(jobId) {
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({ where: { jobId, status: { not: 'cancelled' } } }),
      prisma.expense.findMany({ where: { jobId } }),
    ]);

    const totalIncome = incomes.filter((item) => item.status === 'paid').reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const totalExpenses = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    return {
      jobId,
      incomes,
      expenses,
      totalIncome,
      totalExpenses,
      profitability: totalIncome - totalExpenses,
    };
  },

  async profitability() {
    const jobs = await prisma.job.findMany({
      include: { incomes: true, expenses: true, client: true },
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((job) => {
      const totalIncome = job.incomes.filter((item) => item.status === 'paid').reduce((acc, item) => acc + Number(item.amount || 0), 0);
      const totalExpenses = job.expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
      return {
        jobId: job.id,
        title: job.title,
        client: job.client,
        totalIncome,
        totalExpenses,
        profitability: totalIncome - totalExpenses,
      };
    });
  },
};