import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface InscricaoDocument {
  userId: Types.ObjectId | string;
  subeventoId: Types.ObjectId | string;
  status: 'Confirmada' | 'ListaEspera' | 'Cancelada';
}

const inscricaoSchema = new Schema<InscricaoDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subeventoId: { type: Schema.Types.ObjectId, ref: 'Subevento', required: true },
    status: {
      type: String,
      enum: ['Confirmada', 'ListaEspera', 'Cancelada'],
      default: 'Confirmada',
    },
  },
  { timestamps: true, versionKey: false },
);

inscricaoSchema.index({ userId: 1, subeventoId: 1 }, { unique: true });

withSoftDelete(inscricaoSchema);

const Inscricao = model<InscricaoDocument>('Inscricao', inscricaoSchema);

export default Inscricao;
