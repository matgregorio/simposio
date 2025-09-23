import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface DatasEventoDocument {
  chave: string;
  startDate: Date;
  endDate: Date;
}

const datasSchema = new Schema<DatasEventoDocument>(
  {
    chave: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(datasSchema);

const DatasEvento = model<DatasEventoDocument>('DatasEvento', datasSchema);

export default DatasEvento;
