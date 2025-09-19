import dayjs from 'dayjs';
import { Types } from 'mongoose';

import PermissionChange from '../models/PermissionChange';
import type { UserDocument } from '../models/User';
import User from '../models/User';
import { maskCpf, sanitizeCpf } from '../utils/cpf';
import { AppError } from '../utils/errors';

type UserLean = UserDocument & {
  _id: Types.ObjectId;
};

const removeSensitiveFields = (user: UserLean) => {
  const { senhaHash, refreshTokens, twoFactorSecret, ...safe } = user;
  void senhaHash;
  void refreshTokens;
  void twoFactorSecret;
  return safe;
};

export class UserService {
  static async getProfile(userId: string) {
    const user = await User.findById(userId).lean<UserLean | null>();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }

    return {
      ...removeSensitiveFields(user),
      cpf: maskCpf(user.cpf),
    };
  }

  static async updateProfile(userId: string, data: Partial<UserDocument>) {
    const updates: Record<string, unknown> = { ...data };
    if (data.cpf) {
      updates.cpf = sanitizeCpf(data.cpf as string);
    }

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).lean<UserLean | null>();
    if (!updated) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }

    return removeSensitiveFields(updated);
  }

  static async updateConsent(userId: string, consentimentos: { finalidade: string; aceito: boolean }[]) {
    const formatted = consentimentos.map((item) => ({
      finalidade: item.finalidade,
      aceito: item.aceito,
      data: new Date(),
    }));
    await User.findByIdAndUpdate(userId, { consentimentos: formatted }).exec();
    return formatted;
  }

  static async exportData(userId: string) {
    const user = await User.findById(userId).lean<UserLean | null>();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }

    return removeSensitiveFields(user);
  }

  static async requestDeletion(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    }).exec();
  }

  static async list(filter: Record<string, unknown> = {}) {
    const users = await User.find(filter).lean<UserLean[]>();
    return users.map((user) => ({ ...removeSensitiveFields(user), cpf: maskCpf(user.cpf) }));
  }

  static async changeRole({
    targetUserId,
    newRole,
    actorId,
  }: {
    targetUserId: string;
    newRole: 'admin' | 'sub-admin' | 'user' | 'avaliador-externo';
    actorId: string;
  }) {
    const user = await User.findById(targetUserId).exec();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    await PermissionChange.create({
      targetUserId,
      oldRole,
      newRole,
      approvedBy: actorId,
    });

    const safeUser = removeSensitiveFields(user.toObject() as UserLean);

    return safeUser;
  }

  static async approveDocente(userId: string) {
    const user = await User.findByIdAndUpdate(userId, { aprovadoDocente: true }, { new: true }).exec();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }
    return removeSensitiveFields(user.toObject() as UserLean);
  }

  static async softDelete(userId: string, actorId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, deletedAt: new Date(), deletedBy: actorId },
      { new: true },
    ).exec();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }
    return removeSensitiveFields(user.toObject() as UserLean);
  }

  static docenteWindowOpen(dates: { startDate: Date; endDate: Date }): boolean {
    const now = dayjs();
    return now.isAfter(dayjs(dates.startDate)) && now.isBefore(dayjs(dates.endDate));
  }
}
