import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface SubmissionDocument {
  titulo: string;
  autorId: Types.ObjectId | string;
  orientador?: string;
  coorientador?: string;
  resumoHTML: string;
  palavrasChave: string[];
  subareaId: Types.ObjectId | string;
  tipoTrabalho: string;
  iniciacaoCientifica: boolean;
  apoio?: string;
  status: 'Enviado' | 'Em Avaliação' | 'Aprovado' | 'Reprovado';
  tipoApresentacao: 'N/A' | 'Apresentação Oral' | 'Pôster';
  avaliador1Id?: Types.ObjectId | string;
  avaliador2Id?: Types.ObjectId | string;
}

const submissionSchema = new Schema<SubmissionDocument>(
  {
    titulo: { type: String, required: true },
    autorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orientador: { type: String },
    coorientador: { type: String },
    resumoHTML: { type: String, required: true },
    palavrasChave: { type: [String], default: [] },
    subareaId: { type: Schema.Types.ObjectId, ref: 'Subarea', required: true },
    tipoTrabalho: { type: String, required: true },
    iniciacaoCientifica: { type: Boolean, default: false },
    apoio: { type: String },
    status: {
      type: String,
      enum: ['Enviado', 'Em Avaliação', 'Aprovado', 'Reprovado'],
      default: 'Enviado',
    },
    tipoApresentacao: {
      type: String,
      enum: ['N/A', 'Apresentação Oral', 'Pôster'],
      default: 'N/A',
    },
    avaliador1Id: { type: Schema.Types.ObjectId, ref: 'User' },
    avaliador2Id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(submissionSchema);

const Submission = model<SubmissionDocument>('Submission', submissionSchema);

export default Submission;
