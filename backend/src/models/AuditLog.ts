import { Schema, model } from 'mongoose';

const auditSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String },
    userAgent: { type: String },
    acao: { type: String, required: true },
    entidade: { type: String },
    entidadeId: { type: String },
    antes: { type: Schema.Types.Mixed },
    depois: { type: Schema.Types.Mixed },
    sucesso: { type: Boolean, default: true },
    mensagem: { type: String },
    durationMs: { type: Number },
  },
  { timestamps: true, versionKey: false },
);

auditSchema.index({ acao: 1, createdAt: -1 });

auditSchema.index({ actorId: 1, createdAt: -1 });

const AuditLog = model('AuditLog', auditSchema);

export default AuditLog;
