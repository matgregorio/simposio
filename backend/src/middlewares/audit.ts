import type { NextFunction, Response } from 'express';

import AuditLog from '../models/AuditLog';

import type { AuthenticatedRequest } from './auth';

export const auditTrail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const start = Date.now();
  res.on('finish', async () => {
    try {
      await AuditLog.create({
        actorId: req.user?.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        acao: `${req.method} ${req.originalUrl}`,
        entidade: req.route?.path,
        entidadeId: req.params?.id,
        antes: null,
        depois: null,
        sucesso: res.statusCode < 400,
        mensagem: res.statusMessage,
        durationMs: Date.now() - start,
      });
    } catch (error) {
      // evitar quebrar requisição em caso de erro no log
    }
  });
  next();
};
