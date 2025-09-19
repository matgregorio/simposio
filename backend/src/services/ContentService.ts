import Conteudo from '../models/Conteudo';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export class ContentService {
  static async getBySlug(slug: string) {
    return Conteudo.findOne({ slug }).lean();
  }

  static async upsert({ slug, html, anexos, autorId }: { slug: string; html: string; anexos?: string[]; autorId?: string }) {
    const sanitized = sanitizeHtml(html);
    const content = await Conteudo.findOne({ slug }).exec();

    if (!content) {
      return Conteudo.create({
        slug,
        htmlSanitizado: sanitized,
        anexos: anexos ?? [],
        historico: [
          {
            htmlSanitizado: sanitized,
            autorId,
            criadoEm: new Date(),
          },
        ],
      });
    }

    content.historico.push({ htmlSanitizado: sanitized, autorId, criadoEm: new Date() });
    content.htmlSanitizado = sanitized;
    if (anexos) {
      content.anexos = anexos;
    }
    await content.save();
    return content;
  }

  static async delete(slug: string) {
    return Conteudo.findOneAndUpdate({ slug }, { isDeleted: true, deletedAt: new Date() }).exec();
  }
}
