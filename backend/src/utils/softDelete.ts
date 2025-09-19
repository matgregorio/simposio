import { Schema } from 'mongoose';

export const withSoftDelete = <T>(schema: Schema<T>): void => {
  const softDeleteSchema = new Schema(
    {
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date },
      deletedBy: { type: String },
    },
    { _id: false },
  );

  schema.add(softDeleteSchema);

  schema.pre('find', function () {
    this.where({ isDeleted: false });
  });

  schema.pre('findOne', function () {
    this.where({ isDeleted: false });
  });

  schema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  });
};
