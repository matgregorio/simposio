import crypto from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

import env from '../config/env';
import Certificate from '../models/Certificate';
import CertificateSettings from '../models/CertificateSettings';
import User from '../models/User';
import { AppError } from '../utils/errors';

export class CertificateService {
  static async getSettings() {
    return CertificateSettings.findOne().lean();
  }

  static async upsertSettings(data: {
    topo: string;
    periodo: string;
    edicao: string;
    imagens?: { logo?: string; assinatura1?: string; assinatura2?: string };
  }) {
    return CertificateSettings.findOneAndUpdate({}, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
  }

  static async emit({ userId, tipo }: { userId: string; tipo: 'Participação' | 'Apresentação' }) {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    }

    const settings = await this.getSettings();
    if (!settings) {
      throw new AppError({ statusCode: 400, code: 'CERT_SETTINGS_MISSING', message: 'Configuração de certificado não encontrada.' });
    }

    const hash = crypto.createHash('sha256').update(`${userId}-${Date.now()}`).digest('hex');
    const codigoHash = hash.slice(0, 12).toUpperCase();
    const pdfDir = path.join(env.STORAGE_DIR, 'certificates');
    await fs.mkdir(pdfDir, { recursive: true });
    const filePath = path.join(pdfDir, `${codigoHash}.pdf`);

    const validationUrl = `${process.env.PUBLIC_URL ?? 'http://localhost:5173'}/certificados/validar/${codigoHash}`;
    const qrDataUrl = await QRCode.toDataURL(validationUrl);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = doc.pipe(createWriteStream(filePath));

    doc.fontSize(18).text(settings.topo, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Certificamos que ${user.nome} participou do ${settings.edicao}.`, {
      align: 'left',
    });
    doc.moveDown();
    doc.fontSize(12).text(`Tipo: ${tipo}`);
    doc.text(`Período: ${settings.periodo}`);
    doc.moveDown();
    doc.text('Documento autenticado digitalmente.');

    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    doc.image(Buffer.from(qrImage, 'base64'), doc.page.width - 200, doc.page.height - 200, {
      width: 150,
    });

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });

    const certificate = await Certificate.create({
      userId,
      tipo,
      codigoHash,
      pdfPath: filePath,
      evento: settings.edicao,
      periodo: settings.periodo,
    });

    return certificate;
  }

  static async listByUser(userId: string) {
    return Certificate.find({ userId }).lean();
  }

  static async validate(code: string) {
    const certificate = await Certificate.findOne({ codigoHash: code }).exec();
    if (!certificate) {
      throw new AppError({ statusCode: 404, code: 'CERT_NOT_FOUND', message: 'Certificado não encontrado.' });
    }
    certificate.verificacoesCount += 1;
    await certificate.save();
    return certificate;
  }
}
