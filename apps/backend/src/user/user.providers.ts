import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { DB_DEFAULT_CONNECTION, MODEL_USER } from '../constants';
import { UserModel } from './models/user.model';

export const userRepositoryProviders = [
  {
    provide: MODEL_USER,
    useFactory: (connection: mongoose.Connection) => {
      return getModelForClass(UserModel, {
        existingConnection: connection,
        schemaOptions: {
          collection: 'users',
          read: 'nearest',
          versionKey: false,
        },
      });
    },
    inject: [DB_DEFAULT_CONNECTION],
  },
];
