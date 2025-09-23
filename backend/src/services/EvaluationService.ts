import Evaluation from '../models/Evaluation';
import Submission from '../models/Submission';
import { AppError } from '../utils/errors';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export class EvaluationService {
  static async upsertEvaluation({
    submissionId,
    avaliadorId,
    criterios,
    comentariosHTML,
  }: {
    submissionId: string;
    avaliadorId: string;
    criterios: { label: string; max: number; nota: number }[];
    comentariosHTML?: string;
  }) {
    const submission = await Submission.findById(submissionId).exec();
    if (!submission) {
      throw new AppError({ statusCode: 404, code: 'SUBMISSION_NOT_FOUND', message: 'Trabalho não encontrado.' });
    }

    const total = criterios.reduce((acc, curr) => acc + curr.nota, 0);
    const sanitized = comentariosHTML ? sanitizeHtml(comentariosHTML) : undefined;

    const evaluation = await Evaluation.findOneAndUpdate(
      { submissionId, avaliadorId },
      { criterios, comentariosHTML: sanitized, total },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();

    submission.status = 'Em Avaliação';
    await submission.save();

    return evaluation;
  }

  static async listBySubmission(submissionId: string) {
    return Evaluation.find({ submissionId }).populate('avaliadorId').lean();
  }
}
