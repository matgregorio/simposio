import AreaAtuacao from '../models/AreaAtuacao';
import GrandeArea from '../models/GrandeArea';
import Subarea from '../models/Subarea';

export class CatalogService {
  static listAreas() {
    return AreaAtuacao.find().lean();
  }

  static createArea(data: { nome: string; descricao?: string }) {
    return AreaAtuacao.create(data);
  }

  static updateArea(id: string, data: Partial<{ nome: string; descricao?: string }>) {
    return AreaAtuacao.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static deleteArea(id: string) {
    return AreaAtuacao.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    }).exec();
  }

  static listGrandesAreas() {
    return GrandeArea.find().populate('areaAtuacaoId').lean();
  }

  static createGrandeArea(data: { nome: string; areaAtuacaoId?: string }) {
    return GrandeArea.create(data);
  }

  static updateGrandeArea(id: string, data: Partial<{ nome: string; areaAtuacaoId?: string }>) {
    return GrandeArea.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static deleteGrandeArea(id: string) {
    return GrandeArea.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    }).exec();
  }

  static listSubareas() {
    return Subarea.find().populate('grandeAreaId').lean();
  }

  static createSubarea(data: { nome: string; grandeAreaId: string }) {
    return Subarea.create(data);
  }

  static updateSubarea(id: string, data: Partial<{ nome: string; grandeAreaId: string }>) {
    return Subarea.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static deleteSubarea(id: string) {
    return Subarea.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    }).exec();
  }
}
