import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface Consent {
  finalidade: string;
  aceito: boolean;
  data: Date;
}

export interface UserDocument {
  nome: string;
  email: string;
  senhaHash: string;
  cpf: string;
  telefone?: string;
  tipoParticipante: 'Aluno' | 'Docente' | 'Ex-aluno' | 'Técnico Administrativo' | 'Outros' | 'Não declarado';
  curso?: string;
  role: 'admin' | 'sub-admin' | 'user' | 'avaliador-externo';
  aprovadoDocente: boolean;
  termosRegulamentoAceitoAt?: Date;
  consentimentos: Consent[];
  refreshTokens: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  id: string;
  _id: Types.ObjectId;
}

const consentSchema = new Schema<Consent>(
  {
    finalidade: { type: String, required: true },
    aceito: { type: Boolean, required: true },
    data: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    senhaHash: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    telefone: { type: String },
    tipoParticipante: {
      type: String,
      enum: ['Aluno', 'Docente', 'Ex-aluno', 'Técnico Administrativo', 'Outros', 'Não declarado'],
      default: 'Não declarado',
    },
    curso: { type: String },
    role: {
      type: String,
      enum: ['admin', 'sub-admin', 'user', 'avaliador-externo'],
      default: 'user',
    },
    aprovadoDocente: { type: Boolean, default: false },
    termosRegulamentoAceitoAt: { type: Date },
    consentimentos: { type: [consentSchema], default: [] },
    refreshTokens: { type: [String], default: [] },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ email: 1 });
userSchema.index({ cpf: 1 });

withSoftDelete(userSchema);

const User = model<UserDocument>('User', userSchema);

export default User;
