import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepositoryService } from './user-repository.service';
import { UserDocumentType, UserModel } from './models/user.model';
import mongoose from 'mongoose';
import { ModelRef, referenceToId } from '@monorepo-starter/mongo';
import { HasherService } from '../hasher/hasher.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly repository: UserRepositoryService,
    private readonly hash: HasherService,
  ) {}

  async onModuleInit() {
    const { total } = await this.getUsers({}, { limit: 1 });
    if (total === 0) {
      await this.add({
        firstName: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
      });
    }
  }

  async getUsers(
    filter: {},
    options: {
      sort?: string,
      limit?: number | string,
      skip?: number | string,
      search?: string,
    } = {},
  ): Promise<{ result: UserDocumentType[], total: number }> {
    const result = await this.repository
      .findAll(filter, options.sort, options.limit, options.skip, options.search);
    const total = await this.repository.count(filter, options.search);

    return { result, total };
  }

  getById(id: string): Promise<UserDocumentType | null> {
    if (!mongoose.Types.ObjectId.isValid(id) || (typeof id === 'string' && id.length !== 24)) {
      return;
    }

    return this.repository.find({ _id: id });
  }

  getByIds(id: string): Promise<(UserDocumentType | null)>;
  getByIds(id: string[]): Promise<(UserDocumentType | null)[]>;
  getByIds(id: string | string[]): Promise<(UserDocumentType | null)[] | (UserDocumentType | null)> {
    if (typeof id === 'string') return this.repository.find({ _id: id });
    if (typeof id === 'undefined' || id.length === 0) return Promise.resolve([]);
    return this.repository.findAll({ _id: { $in: id } });
  }

  getUserByEmail(email: string): Promise<UserDocumentType | null> {
    return this.repository.find({ email });
  }

  getUserByPhone(phone: string): Promise<UserDocumentType | null> {
    return this.repository.find({ phone });
  }

  async upsertByPhone(phone: string) {
    const user = await this.getUserByPhone(phone);
    if (user) {
      return user;
    }

    return this.add({ phone });
  }

  async update(user: UserDocumentType, data: Partial<UserModel>) {
    user.setValues(data);
    if (data.password) {
      user.setPassword(await this.hash.hash(data.password));
    }

    return this.repository.save(user);
  }

  async delete(ref: ModelRef<UserModel>): Promise<boolean> {
    const user = await this.repository.fromReference(ref)

    return this.repository.delete({ _id: referenceToId(user) });
  }

  async add(data: Partial<UserDocumentType>): Promise<UserDocumentType> {
    const user = await this.repository.new(data);
    if (data.password) {
      user.setPassword(await this.hash.hash(data.password));
    }

    return this.repository.save(user);
  }
}
