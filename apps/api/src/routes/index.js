import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import rolesRoutes from '../modules/roles/roles.routes.js';
import clientsRoutes from '../modules/clients/clients.routes.js';
import jobsRoutes from '../modules/jobs/jobs.routes.js';
import quotesRoutes from '../modules/quotes/quotes.routes.js';
import incomesRoutes from '../modules/incomes/incomes.routes.js';
import expensesRoutes from '../modules/expenses/expenses.routes.js';
import financeRoutes from '../modules/finance/finance.routes.js';
import agendaRoutes from '../modules/agenda/agenda.routes.js';
import galleryRoutes from '../modules/gallery/gallery.routes.js';
import contactMessagesRoutes from '../modules/contactMessages/contactMessages.routes.js';
import { contactMessagesController } from '../modules/contactMessages/contactMessages.controller.js';
import notificationsRoutes from '../modules/notifications/notifications.routes.js';
import settingsRoutes from '../modules/settings/settings.routes.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.post('/contact', asyncHandler(contactMessagesController.publicCreate));

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/clients', clientsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/quotes', quotesRoutes);
router.use('/incomes', incomesRoutes);
router.use('/expenses', expensesRoutes);
router.use('/finance', financeRoutes);
router.use('/agenda', agendaRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact-messages', contactMessagesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/settings', settingsRoutes);

export default router;
