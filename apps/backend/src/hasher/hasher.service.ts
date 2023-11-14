import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class HasherService {
  constructor() {}

  hash(password: string) {
    return hash(password, 10);
  }

  verify(plain: string, encrypted: string) {
    if (!plain || !encrypted) {
      return Promise.resolve(false);
    }

    return compare(plain, encrypted);
  }
}
