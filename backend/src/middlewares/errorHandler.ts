import type { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  void _next;
  if (err instanceof AppError) {
    if (err.log) {
      logger.error({ err });
    }
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  logger.error({ err }, 'Unhandled error');

  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  });
};
