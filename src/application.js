import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import apiLimiter from './middlewares/apiLimiter.js';
import messageLimiter from './middlewares/messageLimiter.js';
import logUtil from './utils/logUtil.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './docs/openapi.json' with { type: 'json' };

import accountsRouter from './routes/account.routes.js';
import postsRouter from './routes/post.routes.js';

const app = express();

app.set('trust proxy', 1);

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(hpp());
app.use(mongoSanitize());
app.use(compression());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

morgan.token('statusColor', (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return logUtil.colors.red(status);
  if (status >= 400) return logUtil.colors.yellow(status);
  if (status >= 300) return logUtil.colors.cyan(status);
  if (status >= 200) return logUtil.colors.green(status);
  return status;
});
app.use(morgan(':method :url :statusColor :response-time ms'));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api', apiLimiter);

const api = Router();
api.use('/users', accountsRouter);
api.use('/messages', messageLimiter, postsRouter);
app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

export default app;