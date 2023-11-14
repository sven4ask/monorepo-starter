import { BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Token } from './api/login.api';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly service: AuthService,
  ) {}

  @Query(returns => Token)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.service.login(email, password);
    if (!token) {
      throw new BadRequestException('Invalid credentials');
    }
    return { token };
  }
}
