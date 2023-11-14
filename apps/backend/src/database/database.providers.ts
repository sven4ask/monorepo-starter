import { DB_DEFAULT_CONNECTION } from '../constants';
import { DatabaseService } from '@monorepo-starter/mongo';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '@monorepo-starter/logger';

export const databaseProviders = [
  {
    provide: DB_DEFAULT_CONNECTION,
    useFactory: (
      database: DatabaseService,
      config: ConfigService,
      logger: LoggerService,
    ) => {
      // @note: do not open db connection in tests as we use mocks only
      // if db is required override DB_DEFAULT_CONNECTION in the test
      return config.isEnv('test') ? undefined : database.connect(config.getMongoDefaultUrl(), logger);
    },
    inject: [DatabaseService, ConfigService, LoggerService],
  },
];
