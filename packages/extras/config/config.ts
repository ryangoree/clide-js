import { AppConfigStore } from './utils/AppConfigStore';

export interface ClideConfig {
  foo?: string;
}

export const config = new AppConfigStore<ClideConfig>({
  name: 'cli',
  defaults: {
    foo: process.env.FOO,
  },
  schema: {
    foo: {
      type: 'string',
    },
  },
});
