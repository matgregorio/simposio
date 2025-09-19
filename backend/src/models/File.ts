import { Schema, model } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface FileDocument {
  ownerId?: string;
  scope: string;
  path: string;
  mime: string;
  size: number;
  sha256: string;
  signedUrl?: string;
  expiresAt?: Date;
}

const fileSchema = new Schema<FileDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    scope: { type: String, required: true },
    path: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    sha256: { type: String, required: true },
    signedUrl: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(fileSchema);

const File = model<FileDocument>('File', fileSchema);

export default File;
