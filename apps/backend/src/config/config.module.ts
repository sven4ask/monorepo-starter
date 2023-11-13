import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CoreConfigModule } from '@monorepo-starter/config';
import { defaultSchema } from './data/default.schema';

@Module({
  imports: [
    CoreConfigModule.forRoot(defaultSchema, `${__dirname}/data/`),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
