import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { SubeventoService } from '../services/SubeventoService';

const subeventoSchema = z.object({
  body: z.object({
    titulo: z.string(),
    tipo: z.enum(['Palestra', 'Minicurso', 'Oficina', 'Mesa Redonda', 'Apresentação de Trabalho']),
    data: z.string(),
    horario: z.string(),
    duracao: z.number(),
    vagas: z.number(),
    palestrante: z.string(),
    lattes: z.string().optional(),
    local: z.string(),
    descricao: z.string().optional(),
  }),
});

export class SubeventoController {
  static list = async (_req: Request, res: Response) => {
    res.json(await SubeventoService.listPublic());
  };

  static create = [validateRequest(subeventoSchema), async (req: Request, res: Response) => {
    const subevento = await SubeventoService.create({ ...req.body, data: new Date(req.body.data) });
    res.status(201).json(subevento);
  }];

  static update = [validateRequest(subeventoSchema), async (req: Request, res: Response) => {
    const subevento = await SubeventoService.update(req.params.id, { ...req.body, data: new Date(req.body.data) });
    res.json(subevento);
  }];

  static remove = async (req: Request, res: Response) => {
    await SubeventoService.remove(req.params.id);
    res.status(204).send();
  };

  static inscrever = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const inscricao = await SubeventoService.inscrever(req.user.id, req.params.id);
    res.status(201).json(inscricao);
  };

  static cancelar = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const inscricao = await SubeventoService.cancelar(req.params.id, req.user.id);
    res.json(inscricao);
  };
}
