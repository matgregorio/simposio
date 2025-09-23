import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { EvaluationService } from '../services/EvaluationService';

const evaluationSchema = z.object({
  body: z.object({
    submissionId: z.string(),
    criterios: z.array(z.object({ label: z.string(), max: z.number(), nota: z.number() })),
    comentariosHTML: z.string().optional(),
  }),
});

export class EvaluationController {
  static upsert = [validateRequest(evaluationSchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const evaluation = await EvaluationService.upsertEvaluation({
      submissionId: req.body.submissionId,
      avaliadorId: req.user.id,
      criterios: req.body.criterios,
      comentariosHTML: req.body.comentariosHTML,
    });
    res.json(evaluation);
  }];

  static listBySubmission = async (req: Request, res: Response) => {
    const evaluations = await EvaluationService.listBySubmission(req.params.id);
    res.json(evaluations);
  };
}
