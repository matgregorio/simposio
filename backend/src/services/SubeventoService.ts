import dayjs from 'dayjs';

import Inscricao from '../models/Inscricao';
import Subevento, { type SubeventoDocument } from '../models/Subevento';
import { AppError } from '../utils/errors';

export class SubeventoService {
  static listPublic() {
    return Subevento.find().lean<SubeventoDocument & { _id: string }>();
  }

  static async create(data: SubeventoDocument) {
    return Subevento.create(data);
  }

  static async update(id: string, data: Partial<SubeventoDocument>) {
    return Subevento.findByIdAndUpdate(id, data, { new: true }).lean<SubeventoDocument | null>();
  }

  static async remove(id: string) {
    return Subevento.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }).exec();
  }

  static async inscrever(userId: string, subeventoId: string) {
    const subevento = await Subevento.findById(subeventoId).lean();
    if (!subevento) {
      throw new AppError({ statusCode: 404, code: 'SUBEVENTO_NOT_FOUND', message: 'Subevento não encontrado.' });
    }

    const existing = await Inscricao.findOne({ userId, subeventoId }).exec();
    if (existing) {
      throw new AppError({ statusCode: 409, code: 'ALREADY_ENROLLED', message: 'Usuário já inscrito.' });
    }

    const sameTime = await Inscricao.find({ userId })
      .populate<{ subeventoId: (SubeventoDocument & { _id: string }) | null }>('subeventoId')
      .exec();

    const hasConflict = sameTime.some(({ subeventoId: other }) => {
      if (!other) return false;
      const [hour] = other.horario.split(':');
      const [currentHour] = subevento.horario.split(':');
      const startA = dayjs(other.data).hour(Number(hour));
      const startB = dayjs(subevento.data).hour(Number(currentHour));
      return startA.isSame(startB);
    });

    if (hasConflict) {
      throw new AppError({ statusCode: 400, code: 'SCHEDULE_CONFLICT', message: 'Conflito de horário detectado.' });
    }

    const confirmadas = await Inscricao.countDocuments({ subeventoId, status: 'Confirmada' });
    const status = confirmadas >= subevento.vagas ? 'ListaEspera' : 'Confirmada';

    return Inscricao.create({ userId, subeventoId, status });
  }

  static async cancelar(inscricaoId: string, userId: string) {
    const inscricao = await Inscricao.findOne({ _id: inscricaoId, userId }).exec();
    if (!inscricao) {
      throw new AppError({ statusCode: 404, code: 'SUBSCRIPTION_NOT_FOUND', message: 'Inscrição não encontrada.' });
    }
    inscricao.status = 'Cancelada';
    await inscricao.save();
    return inscricao;
  }
}
