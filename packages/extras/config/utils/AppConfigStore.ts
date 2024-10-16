import { JsonStore, type JsonStoreOptions } from './JsonStore.js';
import { getAppConfigPath } from './getAppConfigPath.js';

export type AppConfigStoreOptions<T extends object = Record<string, unknown>> =
  Omit<JsonStoreOptions<T>, 'path'>;

/**
 * A JSON store that reads from the App's root directory
 */
export class AppConfigStore<
  T extends object = Record<string, unknown>,
> extends JsonStore<T> {
  constructor(options: AppConfigStoreOptions<T>) {
    super({
      ...options,
      // TODO: Test if this will work in environments like an AWS Lambda and ensure
      // graceful fallbacks if not.
      path: getAppConfigPath(),
    } as JsonStoreOptions<T>);
  }
}
