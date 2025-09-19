import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface SubeventoDocument {
  titulo: string;
  tipo: 'Palestra' | 'Minicurso' | 'Oficina' | 'Mesa Redonda' | 'Apresentação de Trabalho';
  data: Date;
  horario: string;
  duracao: number;
  vagas: number;
  palestrante: string;
  lattes?: string;
  local: string;
  descricao?: string;
  submissionId?: Types.ObjectId | string;
}

const subeventoSchema = new Schema<SubeventoDocument>(
  {
    titulo: { type: String, required: true },
    tipo: {
      type: String,
      enum: ['Palestra', 'Minicurso', 'Oficina', 'Mesa Redonda', 'Apresentação de Trabalho'],
      required: true,
    },
    data: { type: Date, required: true },
    horario: { type: String, required: true },
    duracao: { type: Number, required: true },
    vagas: { type: Number, required: true, min: 0 },
    palestrante: { type: String, required: true },
    lattes: { type: String },
    local: { type: String, required: true },
    descricao: { type: String },
    submissionId: { type: Schema.Types.ObjectId, ref: 'Submission' },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(subeventoSchema);

const Subevento = model<SubeventoDocument>('Subevento', subeventoSchema);

export default Subevento;
