import 'express-async-errors';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import pinoHttp from 'pino-http';

import env from './config/env';
import logger from './config/logger';
import { auditTrail } from './middlewares/audit';
import { errorHandler } from './middlewares/errorHandler';
import { globalRateLimiter } from './middlewares/rateLimiter';
import routes from './routes';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({
  origin: env.NODE_ENV === 'production' ? [/\.if\.edu\.br$/] : true,
  credentials: true,
}));
app.use(cookieParser(env.CSRF_SECRET));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(globalRateLimiter);
app.use(pinoHttp({ logger }));
app.use(auditTrail);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use(errorHandler);

export default app;
