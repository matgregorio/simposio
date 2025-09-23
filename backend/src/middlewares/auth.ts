import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '../config/env';
import { AppError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new AppError({
      statusCode: 401,
      code: 'UNAUTHENTICATED',
      message: 'Sessão expirada. Faça login novamente.',
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    next(
      new AppError({
        statusCode: 401,
        code: 'INVALID_TOKEN',
        message: 'Token inválido ou expirado.',
        details: error,
      }),
    );
  }
};

export const requireRole = (...roles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError({
        statusCode: 403,
        code: 'FORBIDDEN',
        message: 'Você não possui permissão para acessar este recurso.',
      });
    }

    next();
  };
