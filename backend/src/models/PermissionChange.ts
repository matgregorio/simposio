import { Schema, model, Types } from 'mongoose';

import { withSoftDelete } from '../utils/softDelete';

export interface PermissionChangeDocument {
  targetUserId: Types.ObjectId | string;
  oldRole: string;
  newRole: string;
  approvedBy: Types.ObjectId | string;
}

const permissionChangeSchema = new Schema<PermissionChangeDocument>(
  {
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    oldRole: { type: String, required: true },
    newRole: { type: String, required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false },
);

withSoftDelete(permissionChangeSchema);

const PermissionChange = model<PermissionChangeDocument>(
  'PermissionChange',
  permissionChangeSchema,
);

export default PermissionChange;
