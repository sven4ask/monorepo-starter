import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';
import { HasherModule } from '../hasher/hasher.module';
import { JwtAuthGuard } from './auth-jwt.guard';
import { ExceptionModule } from '../common/filters/exception.module';
import { DatabaseModule } from '../database/database.module';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ExceptionModule,
    ConfigModule,
    DatabaseModule,
    forwardRef(() => UserModule),
    HasherModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
