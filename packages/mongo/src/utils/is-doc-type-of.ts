import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Document } from 'mongoose';

type Ctor<T> = new(...args: any) => T;

export function isDocTypeOf<M>(ctor: Ctor<M>|ModelType<M>, model: object): model is DocumentType<M> {
  if (typeof model !== 'object' || !model /*null*/) return false;
  if (!(model instanceof Document)) return false;

  // Normally in javascript you just would use `model instanceof ctor`
  // e.g. if (organization instanceof OrganizationModel) {
  // however mon(type)goose totally ignores the models we write and just copy the props and methods
  // so there is no way of telling the by us written model class represents an instance of it
  // as it's not an instance. It stores all collections and its name, so this abuses that to figure it out
  const mongooseClass = Object.values(model.db.models).find(obj => {
      // If ctor of model (our written model) is given, check by .name, if typegoose model is given, check by .modelName
      return obj.modelName === ctor.name || obj.modelName === (ctor as ModelType<M>).modelName;
    });
  return mongooseClass && model.collection.name === mongooseClass.collection.name;
}
