import dayjs from 'dayjs';

import Evaluation from '../models/Evaluation';
import Subevento from '../models/Subevento';
import Submission, { type SubmissionDocument } from '../models/Submission';
import { AppError } from '../utils/errors';
import { sanitizeHtml } from '../utils/sanitizeHtml';

type CreateSubmissionInput = Omit<
  SubmissionDocument,
  'status' | 'tipoApresentacao' | 'avaliador1Id' | 'avaliador2Id'
> & {
  status?: SubmissionDocument['status'];
  tipoApresentacao?: SubmissionDocument['tipoApresentacao'];
  avaliador1Id?: string;
  avaliador2Id?: string;
};

export class SubmissionService {
  static async create(data: CreateSubmissionInput) {
    const resumoHTML = sanitizeHtml(data.resumoHTML);
    return Submission.create({ ...data, resumoHTML });
  }

  static async list(filters: Record<string, unknown> = {}) {
    return Submission.find(filters).populate('autorId subareaId').lean<SubmissionDocument[]>();
  }

  static async getById(id: string) {
    const submission = await Submission.findById(id)
      .populate('autorId subareaId')
      .lean<SubmissionDocument | null>();
    if (!submission) {
      throw new AppError({ statusCode: 404, code: 'SUBMISSION_NOT_FOUND', message: 'Trabalho não encontrado.' });
    }
    return submission;
  }

  static async assign(id: string, avaliadores: { avaliador1Id?: string; avaliador2Id?: string }) {
    const submission = await Submission.findByIdAndUpdate(id, avaliadores, { new: true }).exec();
    if (!submission) {
      throw new AppError({ statusCode: 404, code: 'SUBMISSION_NOT_FOUND', message: 'Trabalho não encontrado.' });
    }
    return submission;
  }

  static async updateStatus(id: string, status: 'Enviado' | 'Em Avaliação' | 'Aprovado' | 'Reprovado', tipoApresentacao?: 'N/A' | 'Apresentação Oral' | 'Pôster') {
    const submission = await Submission.findById(id).exec();
    if (!submission) {
      throw new AppError({ statusCode: 404, code: 'SUBMISSION_NOT_FOUND', message: 'Trabalho não encontrado.' });
    }

    submission.status = status;
    if (tipoApresentacao) {
      submission.tipoApresentacao = tipoApresentacao;
    }

    await submission.save();

    if (submission.status === 'Aprovado' && submission.tipoApresentacao === 'Apresentação Oral') {
      const exists = await Subevento.findOne({ submissionId: submission.id }).exec();
      if (!exists) {
        await Subevento.create({
          titulo: submission.titulo,
          tipo: 'Apresentação de Trabalho',
          data: dayjs().toDate(),
          horario: '08:00',
          duracao: 30,
          vagas: 100,
          palestrante: submission.autorId.toString(),
          local: 'A definir',
          descricao: 'Apresentação oral gerada automaticamente.',
          submissionId: submission.id,
        });
      }
    }

    return submission;
  }

  static async remove(id: string) {
    return Submission.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }).exec();
  }

  static async averageScore(submissionId: string) {
    const evaluations = await Evaluation.find({ submissionId }).lean();
    if (evaluations.length === 0) return null;
    const total = evaluations.reduce((acc, curr) => acc + curr.total, 0);
    return total / evaluations.length;
  }
}
