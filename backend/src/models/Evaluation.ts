import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface CriterioNota {
  label: string;
  max: number;
  nota: number;
}

export interface EvaluationDocument {
  submissionId: Types.ObjectId | string;
  avaliadorId: Types.ObjectId | string;
  criterios: CriterioNota[];
  comentariosHTML?: string;
  total: number;
}

const criterioSchema = new Schema<CriterioNota>(
  {
    label: { type: String, required: true },
    max: { type: Number, required: true },
    nota: { type: Number, required: true },
  },
  { _id: false },
);

const evaluationSchema = new Schema<EvaluationDocument>(
  {
    submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true },
    avaliadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    criterios: { type: [criterioSchema], default: [] },
    comentariosHTML: { type: String },
    total: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false },
);

evaluationSchema.index({ submissionId: 1, avaliadorId: 1 }, { unique: true });

withSoftDelete(evaluationSchema);

const Evaluation = model<EvaluationDocument>('Evaluation', evaluationSchema);

export default Evaluation;
