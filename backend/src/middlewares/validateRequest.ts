import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

import { AppError } from '../utils/errors';

export const validateRequest = (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      next(
        new AppError({
          message: 'Dados inválidos enviados.',
          statusCode: 422,
          code: 'VALIDATION_ERROR',
          details: error,
        }),
      );
    }
  };
