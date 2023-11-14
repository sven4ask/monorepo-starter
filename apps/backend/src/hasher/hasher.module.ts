import { Module } from '@nestjs/common';
import { HasherService } from './hasher.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    HasherService,
  ],
  exports: [
    HasherService,
  ],
})
export class HasherModule { }
