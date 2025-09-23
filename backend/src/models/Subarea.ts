import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface SubareaDocument {
  nome: string;
  grandeAreaId: Types.ObjectId | string;
}

const subareaSchema = new Schema<SubareaDocument>(
  {
    nome: { type: String, required: true, trim: true },
    grandeAreaId: { type: Schema.Types.ObjectId, ref: 'GrandeArea', required: true },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(subareaSchema);

const Subarea = model<SubareaDocument>('Subarea', subareaSchema);

export default Subarea;
