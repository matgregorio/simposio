import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { CertificateService } from '../services/CertificateService';

const settingsSchema = z.object({
  body: z.object({
    topo: z.string(),
    periodo: z.string(),
    edicao: z.string(),
    imagens: z
      .object({
        logo: z.string().optional(),
        assinatura1: z.string().optional(),
        assinatura2: z.string().optional(),
      })
      .optional(),
  }),
});

const emitSchema = z.object({
  body: z.object({ userId: z.string(), tipo: z.enum(['Participação', 'Apresentação']) }),
});

export class CertificateController {
  static getSettings = async (_req: Request, res: Response) => {
    const settings = await CertificateService.getSettings();
    res.json(settings);
  };

  static upsertSettings = [validateRequest(settingsSchema), async (req: Request, res: Response) => {
    const settings = await CertificateService.upsertSettings(req.body);
    res.json(settings);
  }];

  static emit = [validateRequest(emitSchema), async (req: Request, res: Response) => {
    const certificate = await CertificateService.emit(req.body);
    res.status(201).json(certificate);
  }];

  static listMy = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const certificates = await CertificateService.listByUser(req.user.id);
    res.json(certificates);
  };

  static validate = async (req: Request, res: Response) => {
    const certificate = await CertificateService.validate(req.params.code);
    res.json({ valido: true, certificate });
  };
}
