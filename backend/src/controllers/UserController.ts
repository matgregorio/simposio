import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { UserService } from '../services/UserService';
import { AppError } from '../utils/errors';

const profileSchema = z.object({
  body: z
    .object({
      nome: z.string().optional(),
      telefone: z.string().optional(),
      curso: z.string().optional(),
      tipoParticipante: z.string().optional(),
      cpf: z.string().optional(),
    })
    .partial(),
});

const consentSchema = z.object({
  body: z.object({ consentimentos: z.array(z.object({ finalidade: z.string(), aceito: z.boolean() })) }),
});

const changeRoleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ role: z.enum(['admin', 'sub-admin', 'user', 'avaliador-externo']) }),
});

export class UserController {
  static me = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const user = await UserService.getProfile(req.user.id);
    res.json(user);
  };

  static updateMe = [validateRequest(profileSchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const updated = await UserService.updateProfile(req.user.id, req.body);
    res.json(updated);
  }];

  static exportMe = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const data = await UserService.exportData(req.user.id);
    res.json(data);
  };

  static consents = [validateRequest(consentSchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const consent = await UserService.updateConsent(req.user.id, req.body.consentimentos);
    res.json(consent);
  }];

  static deleteRequest = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    await UserService.requestDeletion(req.user.id);
    res.status(202).json({ message: 'Solicitação registrada.' });
  };

  static list = async (_req: Request, res: Response) => {
    const users = await UserService.list();
    res.json(users);
  };

  static changeRole = [validateRequest(changeRoleSchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    if (req.user.id === req.params.id) {
      throw new AppError({ statusCode: 400, code: 'ROLE_SELF_CHANGE', message: 'Não é possível alterar o próprio perfil.' });
    }
    const user = await UserService.changeRole({
      targetUserId: req.params.id,
      newRole: req.body.role,
      actorId: req.user.id,
    });
    res.json(user);
  }];

  static approveDocente = async (req: Request, res: Response) => {
    const user = await UserService.approveDocente(req.params.id);
    res.json(user);
  };

  static remove = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    await UserService.softDelete(req.params.id, req.user.id);
    res.status(204).send();
  };
}
