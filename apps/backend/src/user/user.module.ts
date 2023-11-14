import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { UserRepositoryService } from './user-repository.service';
import { userRepositoryProviders } from './user.providers';
import { HasherModule } from '../hasher/hasher.module';
import { UserResolver } from './user.resolver';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    DatabaseModule,
    HasherModule,
    ConfigModule,
  ],
  providers: [...userRepositoryProviders, UserService, UserRepositoryService, UserResolver],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
