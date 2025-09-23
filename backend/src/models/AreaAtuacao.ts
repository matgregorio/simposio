import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface AreaAtuacaoDocument {
  nome: string;
  descricao?: string;
}

const areaSchema = new Schema<AreaAtuacaoDocument>(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(areaSchema);

const AreaAtuacao = model<AreaAtuacaoDocument>('AreaAtuacao', areaSchema);

export default AreaAtuacao;
