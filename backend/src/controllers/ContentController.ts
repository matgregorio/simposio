import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { ContentService } from '../services/ContentService';

const upsertSchema = z.object({
  params: z.object({ slug: z.string() }),
  body: z.object({ html: z.string(), anexos: z.array(z.string()).optional() }),
});

export class ContentController {
  static get = async (req: Request, res: Response) => {
    const content = await ContentService.getBySlug(req.params.slug);
    if (!content) {
      return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    }
    res.json(content);
  };

  static upsert = [validateRequest(upsertSchema), async (req: AuthenticatedRequest, res: Response) => {
    const content = await ContentService.upsert({
      slug: req.params.slug,
      html: req.body.html,
      anexos: req.body.anexos,
      autorId: req.user?.id,
    });
    res.json(content);
  }];

  static remove = async (req: Request, res: Response) => {
    await ContentService.delete(req.params.slug);
    res.status(204).send();
  };
}
