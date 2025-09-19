import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface ImagemConfig {
  logo?: string;
  assinatura1?: string;
  assinatura2?: string;
}

export interface CertificateSettingsDocument {
  topo: string;
  periodo: string;
  edicao: string;
  imagens: ImagemConfig;
}

const imagemSchema = new Schema<ImagemConfig>(
  {
    logo: { type: String },
    assinatura1: { type: String },
    assinatura2: { type: String },
  },
  { _id: false },
);

const certificateSettingsSchema = new Schema<CertificateSettingsDocument>(
  {
    topo: { type: String, required: true },
    periodo: { type: String, required: true },
    edicao: { type: String, required: true },
    imagens: { type: imagemSchema, default: {} },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(certificateSettingsSchema);

const CertificateSettings = model<CertificateSettingsDocument>(
  'CertificateSettings',
  certificateSettingsSchema,
);

export default CertificateSettings;
