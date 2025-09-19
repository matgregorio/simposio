import { createReadStream } from 'node:fs';
import { promises as fs } from 'node:fs';

import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateRequest } from '../middlewares/validateRequest';
import { AcervoService, uploadMiddleware } from '../services/AcervoService';

const createSchema = z.object({
  body: z.object({
    ano: z.coerce.number(),
    titulo: z.string(),
    autores: z.array(z.string()),
    palavrasChave: z.array(z.string()),
  }),
});

export class AcervoController {
  static list = async (req: Request, res: Response) => {
    const items = await AcervoService.list({
      ano: req.query.ano ? Number(req.query.ano) : undefined,
      palavra: req.query.palavra as string,
    });
    const payload = items.map((item) => ({
      ...item,
      downloadUrl: `/api/acervo/${item._id.toString()}/download`,
    }));
    res.json(payload);
  };

  static upload = [uploadMiddleware.single('arquivo'), validateRequest(createSchema), async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Arquivo obrigatório.' });
    }
    const autores = Array.isArray(req.body.autores)
      ? req.body.autores
      : String(req.body.autores || '')
          .split(',')
          .map((autor) => autor.trim())
          .filter(Boolean);
    const palavrasChave = Array.isArray(req.body.palavrasChave)
      ? req.body.palavrasChave
      : String(req.body.palavrasChave || '')
          .split(',')
          .map((palavra) => palavra.trim())
          .filter(Boolean);

    const item = await AcervoService.create({
      ano: req.body.ano,
      titulo: req.body.titulo,
      autores,
      palavrasChave,
      file,
    });
    const plain = item.toObject();
    res.status(201).json({ ...plain, downloadUrl: `/api/acervo/${plain._id}/download` });
  }];

  static download = async (req: Request, res: Response) => {
    const item = await AcervoService.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    await fs.access(item.arquivo.path);
    res.setHeader('Content-Type', item.arquivo.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${item.arquivo.originalName}"`);
    createReadStream(item.arquivo.path).pipe(res);
  };
}
