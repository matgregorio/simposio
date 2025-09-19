import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateRequest } from '../middlewares/validateRequest';
import { DatesService } from '../services/DatesService';

const dateSchema = z.object({
  body: z.object({
    chave: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),
});

export class DatesController {
  static list = async (_req: Request, res: Response) => {
    res.json(await DatesService.list());
  };

  static create = [validateRequest(dateSchema), async (req: Request, res: Response) => {
    const date = await DatesService.create({
      chave: req.body.chave,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    });
    res.status(201).json(date);
  }];

  static update = [validateRequest(dateSchema), async (req: Request, res: Response) => {
    const date = await DatesService.update(req.params.id, {
      chave: req.body.chave,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    });
    res.json(date);
  }];

  static delete = async (req: Request, res: Response) => {
    await DatesService.delete(req.params.id);
    res.status(204).send();
  };
}
