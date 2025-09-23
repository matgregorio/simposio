import { randomUUID } from 'node:crypto';

import argon2 from 'argon2';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

import env from '../config/env';
import type { UserDocument } from '../models/User';
import User from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { sanitizeCpf } from '../utils/cpf';
import { AppError } from '../utils/errors';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
}

export class AuthService {
  static async register(data: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone?: string;
    tipoParticipante: string;
    curso?: string;
    consentimentos: { finalidade: string; aceito: boolean }[];
  }): Promise<UserDocument> {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError({
        statusCode: 409,
        code: 'EMAIL_IN_USE',
        message: 'E-mail já cadastrado.',
      });
    }

    const senhaHash = await argon2.hash(data.senha, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const consentimentos = data.consentimentos.map((consent) => ({
      finalidade: consent.finalidade,
      aceito: consent.aceito,
      data: new Date(),
    }));

    const user = await UserRepository.create({
      nome: data.nome,
      email: data.email,
      senhaHash,
      cpf: sanitizeCpf(data.cpf),
      telefone: data.telefone,
      tipoParticipante: data.tipoParticipante,
      curso: data.curso,
      consentimentos,
      termosRegulamentoAceitoAt: new Date(),
    });

    return user;
  }

  static generateTokens(user: { id: string; role: string }): TokenPair {
    const accessToken = jwt.sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '15m',
    });

    const refreshTokenId = randomUUID();
    const refreshToken = jwt.sign({ tokenId: refreshTokenId }, env.JWT_REFRESH_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken, refreshTokenId };
  }

  static async attachRefreshToken(userId: string, tokenId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $push: { refreshTokens: tokenId } }).exec();
  }

  static async revokeRefreshToken(userId: string, tokenId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: tokenId } }).exec();
  }

  static async login(email: string, senha: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas.',
      });
    }

    const passwordMatch = await argon2.verify(user.senhaHash, senha);
    if (!passwordMatch) {
      throw new AppError({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas.',
      });
    }

    if (user.tipoParticipante === 'Docente' && !user.aprovadoDocente) {
      throw new AppError({
        statusCode: 403,
        code: 'DOCENTE_PENDING_APPROVAL',
        message: 'Conta de docente aguardando aprovação da organização.',
      });
    }

    const tokens = this.generateTokens({ id: user.id, role: user.role });
    await this.attachRefreshToken(user.id, tokens.refreshTokenId);

    return { user, tokens };
  }

  static async refreshToken(oldToken: string) {
    try {
      const payload = jwt.verify(oldToken, env.JWT_REFRESH_SECRET) as {
        sub: string;
        tokenId: string;
        exp: number;
      };

      const user = await UserRepository.findById(payload.sub);
      if (!user) {
        throw new AppError({ statusCode: 401, code: 'INVALID_REFRESH', message: 'Sessão inválida.' });
      }

      if (!user.refreshTokens.includes(payload.tokenId)) {
        throw new AppError({
          statusCode: 401,
          code: 'ROTATE_REFRESH',
          message: 'Token já utilizado. Faça login novamente.',
        });
      }

      await this.revokeRefreshToken(user.id, payload.tokenId);
      const tokens = this.generateTokens({ id: user.id, role: user.role });
      await this.attachRefreshToken(user.id, tokens.refreshTokenId);

      return { user, tokens };
    } catch (error) {
      throw new AppError({ statusCode: 401, code: 'INVALID_REFRESH', message: 'Sessão inválida.' });
    }
  }

  static async logout(userId: string, refreshTokenId: string): Promise<void> {
    await this.revokeRefreshToken(userId, refreshTokenId);
  }

  static async enable2FA(userId: string) {
    const secret = speakeasy.generateSecret({ name: 'Simpósio IF Sudeste MG' });
    await User.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
    }).exec();

    return secret.otpauth_url;
  }

  static async verify2FA(userId: string, token: string) {
    const user = await UserRepository.findById(userId);
    if (!user?.twoFactorSecret) {
      throw new AppError({ statusCode: 400, code: '2FA_NOT_ENABLED', message: '2FA não habilitado.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      throw new AppError({ statusCode: 400, code: 'INVALID_2FA', message: 'Token 2FA inválido.' });
    }

    await User.findByIdAndUpdate(userId, { twoFactorEnabled: true }).exec();
  }

  static decodeRefreshToken(token: string): { userId: string; tokenId: string; exp: Date } | null {
    const payload = jwt.decode(token);
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const { sub, tokenId, exp } = payload as { sub?: string; tokenId?: string; exp?: number };
    if (!sub || !tokenId || !exp) {
      return null;
    }

    return { userId: sub, tokenId, exp: dayjs.unix(exp).toDate() };
  }
}
