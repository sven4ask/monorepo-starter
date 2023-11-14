import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../enums/role.enum';

@ObjectType()
export class UserModel {

  @Field(type => String)
  readonly firstName: string;

  @Field(type => String)
  readonly lastName: string;

  @Field(type => String)
  readonly email: string;

  @Field(type => String, { nullable: true })
  readonly phone?: string;

  @Field(type => UserRole)
  readonly role: UserRole;

  @Field(type => String)
  readonly created: Date;
}
