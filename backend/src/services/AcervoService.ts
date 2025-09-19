import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { Types } from 'mongoose';
import multer from 'multer';

import env from '../config/env';
import AcervoItem, { type AcervoItemDocument } from '../models/AcervoItem';
import { AppError } from '../utils/errors';

const storageDir = env.STORAGE_DIR;

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['application/pdf'].includes(file.mimetype)) {
      return cb(new AppError({ statusCode: 400, code: 'INVALID_FILE', message: 'Somente PDFs são permitidos.' }));
    }
    cb(null, true);
  },
});

export class AcervoService {
  static async list(
    filters: Partial<{ ano: number; palavra: string }> = {},
  ): Promise<Array<AcervoItemDocument & { _id: Types.ObjectId }>> {
    const query: Record<string, unknown> = {};
    if (filters.ano) query.ano = filters.ano;
    if (filters.palavra) query.palavrasChave = { $regex: filters.palavra, $options: 'i' };
    return AcervoItem.find(query).lean<Array<AcervoItemDocument & { _id: Types.ObjectId }>>();
  }

  static async findById(id: string): Promise<(AcervoItemDocument & { _id: Types.ObjectId }) | null> {
    return AcervoItem.findById(id).lean<AcervoItemDocument & { _id: Types.ObjectId }>();
  }

  static async create(data: {
    ano: number;
    titulo: string;
    autores: string[];
    palavrasChave: string[];
    file: Express.Multer.File;
  }) {
    await fs.mkdir(storageDir, { recursive: true });

    const hash = crypto.createHash('sha256').update(data.file.buffer).digest('hex');
    const fileName = `${hash}.pdf`;
    const filePath = path.join(storageDir, fileName);
    await fs.writeFile(filePath, data.file.buffer);

    return AcervoItem.create({
      ano: data.ano,
      titulo: data.titulo,
      autores: data.autores,
      palavrasChave: data.palavrasChave,
      arquivo: {
        path: filePath,
        mime: data.file.mimetype,
        size: data.file.size,
        originalName: data.file.originalname,
        sha256: hash,
      },
    });
  }
}
