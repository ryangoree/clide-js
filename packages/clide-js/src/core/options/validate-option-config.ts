import { OptionsConfigError } from 'src/core/errors';
import type { OptionsConfig } from './types';

/**
 * @throws {OptionsConfigError} Throws an error if the options config is invalid.
 * @group Options
 */
export function validateOptionsConfig(options: OptionsConfig) {
  for (const [name, config] of Object.entries(options)) {
    const { required, conflicts, requires } = config;

    if (required && conflicts?.length) {
      throw new OptionsConfigError(
        `Option "${name}" cannot be required and conflict with other options`,
      );
    }

    if (required && requires?.length) {
      throw new OptionsConfigError(
        `Option "${name}" cannot be required and require other options`,
      );
    }
  }
}
