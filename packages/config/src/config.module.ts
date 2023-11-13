import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigLoaderService } from './config-loader.service';
import convict from 'convict';

@Global()
@Module({})
export class CoreConfigModule {
  static forRoot(
    schema?: convict.Schema<any>,
    path?: string,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ConfigLoaderService,
        useFactory: async () => {
          // make sure config module is initialized before everything else
          const service = new ConfigLoaderService();
          await service.load(schema, path);
          return service;
        },
      }
    ];

    return {
      module: CoreConfigModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
