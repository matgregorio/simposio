import type { Request, Response } from 'express';
import { z } from 'zod';

import env from '../config/env';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../middlewares/validateRequest';
import { AuthService } from '../services/AuthService';

const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(8),
    cpf: z.string().min(11),
    telefone: z.string().optional(),
    tipoParticipante: z.string(),
    curso: z.string().optional(),
    consentimentos: z.array(z.object({ finalidade: z.string(), aceito: z.boolean() })),
  }),
});

const loginSchema = z.object({
  body: z.object({ email: z.string().email(), senha: z.string().min(6) }),
});

const refreshSchema = z.object({
  cookies: z.object({ refreshToken: z.string().min(10) }).partial(),
});

const twoFASchema = z.object({ body: z.object({ token: z.string().min(6) }) });

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  domain: env.COOKIE_DOMAIN,
};

export class AuthController {
  static register = [authRateLimiter, validateRequest(registerSchema), async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);
    return res.status(201).json({ message: 'Usuário registrado com sucesso.', id: user.id });
  }];

  static login = [authRateLimiter, validateRequest(loginSchema), async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    const { user, tokens } = await AuthService.login(email, senha);

    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      id: user.id,
      nome: user.nome,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  }];

  static refresh = [validateRequest(refreshSchema), async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ code: 'INVALID_REFRESH', message: 'Sessão inválida.' });
    }

    const { user, tokens } = await AuthService.refreshToken(token);

    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ id: user.id, nome: user.nome, role: user.role });
  }];

  static logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = AuthService.decodeRefreshToken(token);
      if (decoded) {
        await AuthService.logout(decoded.userId, decoded.tokenId);
      }
    }

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(204).send();
  };

  static enable2FA = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    const otpauth = await AuthService.enable2FA(req.user.id);
    res.json({ otpauth });
  };

  static verify2FA = [validateRequest(twoFASchema), async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sessão expirada. Faça login novamente.' });
    }
    await AuthService.verify2FA(req.user.id, req.body.token);
    res.json({ message: '2FA habilitado com sucesso.' });
  }];
}
