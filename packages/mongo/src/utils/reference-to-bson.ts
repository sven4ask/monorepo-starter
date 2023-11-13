import {DocumentType, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export function referenceToBson(value: Ref<DocumentType<any>> | string | DocumentType<any>): mongoose.Types.ObjectId {
  const isObject = value /*not null*/ && typeof value === 'object';

  switch(true) {
    case typeof value === 'string' || typeof value === 'number':
      return new mongoose.Types.ObjectId(value);

    case !isObject:
    default:
      return undefined; // Its not a string|number, or an object

    case value instanceof mongoose.Types.ObjectId:
      return value;

    case value instanceof Buffer:
    case value instanceof Uint8Array:
      return new mongoose.Types.ObjectId(value)

    case '_id' in value:
      return referenceToBson(value._id);

    case 'id' in value:
      return referenceToBson(value.id);
  }
}
