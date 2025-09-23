import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';

const createRateLimiter = (options: Parameters<typeof rateLimit>[0]): RateLimitRequestHandler => {
  if (process.env.NODE_ENV === 'test') {
    const handler = ((req, _res, next) => next()) as RateLimitRequestHandler;
    (handler as unknown as { store: { shutdown: () => void } }).store = {
      shutdown: () => undefined,
    };
    return handler;
  }
  return rateLimit(options);
};

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    code: 'TOO_MANY_REQUESTS',
    message: 'Limite de requisições excedido. Tente novamente mais tarde.',
  },
});

export const authRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    code: 'TOO_MANY_ATTEMPTS',
    message: 'Muitas tentativas de autenticação. Aguarde alguns minutos.',
  },
});
