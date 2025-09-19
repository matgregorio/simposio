import User from '../models/User';

export const UserRepository = {
  findByEmail: (email: string) => User.findOne({ email }).exec(),
  findById: (id: string) => User.findById(id).exec(),
  create: (data: Record<string, unknown>) => User.create(data),
  list: (filter: Record<string, unknown> = {}) => User.find(filter).exec(),
  updateById: (id: string, data: Record<string, unknown>) =>
    User.findByIdAndUpdate(id, data, { new: true }).exec(),
};
