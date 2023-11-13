import { DocumentType, Ref } from '@typegoose/typegoose';

export function referenceToId(value: Ref<DocumentType<any>>): string {
  if (typeof value !== 'object' || !value) return String(value);
  if (value._bsontype === 'ObjectId') return value._bsontype.id.toString();
  return String((value as any)._id ?? value.id) ;
}
