import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
