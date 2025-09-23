import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface ConteudoVersao {
  htmlSanitizado: string;
  autorId?: string;
  criadoEm: Date;
}

export interface ConteudoDocument {
  slug: string;
  htmlSanitizado: string;
  anexos: string[];
  historico: ConteudoVersao[];
}

const versaoSchema = new Schema<ConteudoVersao>(
  {
    htmlSanitizado: { type: String, required: true },
    autorId: { type: Schema.Types.ObjectId, ref: 'User' },
    criadoEm: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conteudoSchema = new Schema<ConteudoDocument>(
  {
    slug: { type: String, required: true, unique: true },
    htmlSanitizado: { type: String, required: true },
    anexos: { type: [String], default: [] },
    historico: { type: [versaoSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(conteudoSchema);

const Conteudo = model<ConteudoDocument>('Conteudo', conteudoSchema);

export default Conteudo;
