import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface ArquivoMetadata {
  path: string;
  mime: string;
  size: number;
  originalName: string;
  sha256: string;
}

export interface AcervoItemDocument {
  ano: number;
  titulo: string;
  autores: string[];
  palavrasChave: string[];
  arquivo: ArquivoMetadata;
}

const arquivoSchema = new Schema<ArquivoMetadata>(
  {
    path: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    originalName: { type: String, required: true },
    sha256: { type: String, required: true },
  },
  { _id: false },
);

const acervoSchema = new Schema<AcervoItemDocument>(
  {
    ano: { type: Number, required: true },
    titulo: { type: String, required: true },
    autores: { type: [String], required: true },
    palavrasChave: { type: [String], default: [] },
    arquivo: { type: arquivoSchema, required: true },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(acervoSchema);

const AcervoItem = model<AcervoItemDocument>('AcervoItem', acervoSchema);

export default AcervoItem;
