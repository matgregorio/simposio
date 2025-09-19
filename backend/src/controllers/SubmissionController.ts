import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { SubmissionService } from '../services/SubmissionService';

const submissionSchema = z.object({
  body: z.object({
    titulo: z.string(),
    orientador: z.string().optional(),
    coorientador: z.string().optional(),
    resumoHTML: z.string(),
    palavrasChave: z.array(z.string()),
    subareaId: z.string(),
    tipoTrabalho: z.string(),
    iniciacaoCientifica: z.boolean(),
    apoio: z.string().optional(),
    tipoApresentacao: z.enum(['N/A', 'Apresentação Oral', 'Pôster']).default('N/A'),
  }),
});

const assignSchema = z.object({
  body: z.object({ avaliador1Id: z.string().optional(), avaliador2Id: z.string().optional() }),
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['Enviado', 'Em Avaliação', 'Aprovado', 'Reprovado']),
    tipoApresentacao: z.enum(['N/A', 'Apresentação Oral', 'Pôster']).optional(),
  }),
});

export class SubmissionController {
  static list = async (req: Request, res: Response) => {
    const submissions = await SubmissionService.list(req.query);
    res.json(submissions);
  };

  static create = [validateRequest(submissionSchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const submission = await SubmissionService.create({ ...req.body, autorId: req.user.id });
    res.status(201).json(submission);
  }];

  static getById = async (req: Request, res: Response) => {
    const submission = await SubmissionService.getById(req.params.id);
    res.json(submission);
  };

  static assign = [validateRequest(assignSchema), async (req: Request, res: Response) => {
    const submission = await SubmissionService.assign(req.params.id, req.body);
    res.json(submission);
  }];

  static updateStatus = [validateRequest(statusSchema), async (req: Request, res: Response) => {
    const submission = await SubmissionService.updateStatus(
      req.params.id,
      req.body.status,
      req.body.tipoApresentacao,
    );
    res.json(submission);
  }];

  static remove = async (req: Request, res: Response) => {
    await SubmissionService.remove(req.params.id);
    res.status(204).send();
  };
}
