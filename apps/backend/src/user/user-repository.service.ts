import { Inject, Injectable } from '@nestjs/common';
import { PopulateOptions } from 'mongoose';
import { MODEL_USER } from '../constants';
import { UserModel, UserReturnModelType } from './models/user.model';
import { BaseRepositoryService } from '@monorepo-starter/mongo';

@Injectable()
export class UserRepositoryService extends BaseRepositoryService<UserModel> {
  constructor(
    @Inject(MODEL_USER)
    model: UserReturnModelType,
  ) {
    super(model);
  }

  get populate(): PopulateOptions[] {
    return [];
  }
}
