import { OptionsError } from 'src/core/errors';
import type { OptionValues } from 'src/core/parse';
import type { OptionType, OptionsConfig } from './option';

/**
 * Validates the options for a command by checking for required options,
 * conflicts, and dependencies.
 * @param config - The option config to be validated.
 * @throws {OptionsError} Throws an error if the options are invalid.
 * @group Options
 */
export function validateOptions(options: OptionValues, config: OptionsConfig) {
  const configEntries = Object.entries(config);
  const valuesByNameAndAlias: Record<string, unknown> = {};

  // Build up a map of option values keyed by option name and aliases
  for (const [name, value] of Object.entries(options)) {
    // Find the config for the option
    for (const [configName, config] of configEntries) {
      const isConfigForOption =
        configName === name || config.alias?.includes(name);

      // If found, add the value to the map for the option name and all aliases
      if (isConfigForOption) {
        valuesByNameAndAlias[configName] = value;
        for (const alias of config.alias || []) {
          valuesByNameAndAlias[alias] = value;
        }

        // config found, stop searching
        break;
      }
    }
  }

  // Validate each option based on its config
  for (const [name, option] of Object.entries(config)) {
    const hasValue = name in valuesByNameAndAlias;
    const value = valuesByNameAndAlias[name];

    // Validate option value
    if (hasValue) {
      validateOptionType(value, name, option.type);
    }

    // Validate that required options are present
    if (option.required && !hasValue) {
      throw new OptionsError(`Option "${name}" is required`);
    }

    // Validate option conflicts
    for (const conflict of option.conflicts || []) {
      const hasConflict = conflict in valuesByNameAndAlias;
      if (hasConflict) {
        throw new OptionsError(
          `Option "${conflict}" conflicts with option "${name}"`,
        );
      }
    }

    // Validate option dependencies
    for (const dependency of option.requires || []) {
      const hasDependency = dependency in valuesByNameAndAlias;
      if (!hasDependency) {
        throw new OptionsError(
          `Option "${name}" requires option "${dependency}"`,
        );
      }
    }
  }
}

/**
 * Validates an option value based on its type and throws an error if the value
 * is invalid.
 * @param value - The option value to validate.
 * @param name - The name of the option.
 * @param type - The expected type of the option.
 * @throws {OptionsError} Throws an error if the option value is invalid.
 * @group Options
 */
export function validateOptionType(
  value: unknown,
  name: string,
  type: OptionType,
): void {
  if (value === undefined) {
    return;
  }

  switch (type) {
    case 'string':
    case 'secret':
      if (typeof value !== 'string') {
        throw new OptionsError(`Option "${name}" must be a string`);
      }
      break;
    case 'number':
      if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new OptionsError(`Option "${name}" must be a number`);
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        throw new OptionsError(`Option "${name}" must be a boolean`);
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        throw new OptionsError(`Option "${name}" must be an array`);
      }
      break;
  }
}
