import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: [env.webUrl, env.adminUrl], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use('/storage/pdfs', express.static(path.resolve(process.cwd(), env.pdfStoragePath)));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CF Metal Pintura PRO API is running' });
});

app.use(env.apiPrefix, apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
