import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface GrandeAreaDocument {
  nome: string;
  areaAtuacaoId?: Types.ObjectId | string;
}

const grandeAreaSchema = new Schema<GrandeAreaDocument>(
  {
    nome: { type: String, required: true, trim: true },
    areaAtuacaoId: { type: Schema.Types.ObjectId, ref: 'AreaAtuacao' },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(grandeAreaSchema);

const GrandeArea = model<GrandeAreaDocument>('GrandeArea', grandeAreaSchema);

export default GrandeArea;
