import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface CertificateDocument {
  userId: Types.ObjectId | string;
  tipo: 'Participação' | 'Apresentação';
  codigoHash: string;
  pdfPath: string;
  evento: string;
  periodo: string;
  assinaturaDigital?: string;
  verificacoesCount: number;
  id: string;
  _id: Types.ObjectId;
}

const certificateSchema = new Schema<CertificateDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: ['Participação', 'Apresentação'], required: true },
    codigoHash: { type: String, required: true, unique: true },
    pdfPath: { type: String, required: true },
    evento: { type: String, required: true },
    periodo: { type: String, required: true },
    assinaturaDigital: { type: String },
    verificacoesCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(certificateSchema);

const Certificate = model<CertificateDocument>('Certificate', certificateSchema);

export default Certificate;
