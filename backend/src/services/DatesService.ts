import dayjs from 'dayjs';

import DatasEvento from '../models/DatasEvento';

export class DatesService {
  static list() {
    return DatasEvento.find().lean();
  }

  static create(data: { chave: string; startDate: Date; endDate: Date }) {
    return DatasEvento.create(data);
  }

  static update(id: string, data: Partial<{ chave: string; startDate: Date; endDate: Date }>) {
    return DatasEvento.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static delete(id: string) {
    return DatasEvento.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }).exec();
  }

  static isWindowOpen(chave: string) {
    return DatasEvento.findOne({ chave }).then((date) => {
      if (!date) return false;
      const now = dayjs();
      return now.isAfter(dayjs(date.startDate)) && now.isBefore(dayjs(date.endDate));
    });
  }
}
