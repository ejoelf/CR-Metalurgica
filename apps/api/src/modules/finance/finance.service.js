import { prisma } from '../../config/prisma.js';

function getMonthRange(query = {}) {
  const now = new Date();
  const year = Number(query.year || now.getFullYear());
  const month = Number(query.month || now.getMonth() + 1);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end, year, month };
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

  async byJob(jobId) {
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({ where: { jobId } }),
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
