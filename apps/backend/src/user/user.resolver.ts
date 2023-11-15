import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './api/user.api';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';

@Resolver('User')
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(returns => UserModel)
  @UseGuards(JwtAuthGuard)
  async getUser(@Args('id') id: string) {
    const user = await this.service.getById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
