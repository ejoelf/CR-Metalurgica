import { prisma } from '../config/prisma.js';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const activeJobStatuses = ['pending', 'quoted', 'approved', 'production', 'painted', 'on_hold', 'rescheduled', 'completed'];
const pendingQuoteStatuses = ['draft', 'sent'];

function getMonthRange(year, monthIndex) { const start = new Date(year, monthIndex, 1); const end = new Date(year, monthIndex + 1, 1); return { start, end }; }
function currentMonthRange() { const now = new Date(); return getMonthRange(now.getFullYear(), now.getMonth()); }
function todayRange() { const start = new Date(); start.setHours(0, 0, 0, 0); const end = new Date(start); end.setDate(start.getDate() + 1); return { start, end }; }

async function buildFinanceChart() {
  const now = new Date(); const months = [];
  for (let index = 5; index >= 0; index -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const { start, end } = getMonthRange(cursor.getFullYear(), cursor.getMonth());
    const [incomes, expenses] = await Promise.all([prisma.income.aggregate({ where: { status: 'paid', paidAt: { gte: start, lt: end } }, _sum: { amount: true } }), prisma.expense.aggregate({ where: { expenseDate: { gte: start, lt: end } }, _sum: { amount: true } })]);
    const ingresos = Number(incomes._sum.amount || 0); const egresos = Number(expenses._sum.amount || 0);
    months.push({ name: monthNames[cursor.getMonth()], ingresos, egresos, balance: ingresos - egresos });
  }
  return months;
}

async function buildJobStatusSummary() {
  const statuses = ['pending', 'quoted', 'approved', 'production', 'painted', 'on_hold', 'rescheduled', 'completed', 'delivered', 'cancelled'];
  return Promise.all(statuses.map(async (status) => ({ status, count: await prisma.job.count({ where: { status } }) })));
}

export const dashboardService = {
  async getDashboard() {
    const { start, end } = currentMonthRange();
    const today = todayRange();
    const [activeClients, activeJobs, pendingQuotes, financeIncome, financeExpenses, chart, jobStatuses, latestMovements, todayEvents, nextEventsFallback, recentQuotes] = await Promise.all([
      prisma.client.count({ where: { status: { not: 'archived' } } }),
      prisma.job.count({ where: { status: { in: activeJobStatuses } } }),
      prisma.quote.count({ where: { status: { in: pendingQuoteStatuses } } }),
      prisma.income.aggregate({ where: { status: 'paid', paidAt: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { expenseDate: { gte: start, lt: end } }, _sum: { amount: true } }),
      buildFinanceChart(),
      buildJobStatusSummary(),
      prisma.income.findMany({ where: { status: 'paid' }, include: { client: true, job: true }, orderBy: { paidAt: 'desc' }, take: 4 }),
      prisma.agendaEvent.findMany({ where: { status: { not: 'cancelled' }, startAt: { gte: today.start, lt: today.end } }, include: { client: true, job: true }, orderBy: { startAt: 'asc' }, take: 8 }),
      prisma.agendaEvent.findMany({ where: { status: { not: 'cancelled' }, startAt: { gte: new Date() } }, include: { client: true, job: true }, orderBy: { startAt: 'asc' }, take: 4 }),
      prisma.quote.findMany({ include: { client: true, job: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    ]);
    const totalIncome = Number(financeIncome._sum.amount || 0); const totalExpenses = Number(financeExpenses._sum.amount || 0);
    const nextEvents = todayEvents.length ? todayEvents : nextEventsFallback;
    return { kpis: { activeClients, activeJobs, pendingQuotes, monthlyBalance: totalIncome - totalExpenses, totalIncome, totalExpenses }, chart, jobStatuses, latestMovements: latestMovements.map((item) => ({ id: item.id, title: item.title, amount: Number(item.amount || 0), date: item.paidAt || item.createdAt, clientName: item.client?.fullName || null, jobTitle: item.job?.title || null })), nextEvents: nextEvents.map((item) => ({ id: item.id, title: item.title, type: item.type, status: item.status, startAt: item.startAt, clientName: item.client?.fullName || null, jobTitle: item.job?.title || null })), recentQuotes: recentQuotes.map((item) => ({ id: item.id, quoteNumber: item.quoteNumber, title: item.title, status: item.status, total: Number(item.total || 0), createdAt: item.createdAt, clientName: item.client?.fullName || null, jobTitle: item.job?.title || null })) };
  },
};