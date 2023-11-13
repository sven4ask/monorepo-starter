export const defaultSchema= {
  app: {
    id: {
      default: 'stam-software-monorepo-starter',
      env: 'APP_ID',
    },
    name: {
      default: 'Starterset for monorepo based backend',
      env: 'APP_NAME',
    },
    shorthand: {
      default: 'platform',
      env: 'APP_SHORTHAND',
    },
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'acceptation', 'staging', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
};

export type DefaultSchema = typeof defaultSchema;
