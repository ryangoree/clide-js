import { Client } from 'src/core/client';
import {
  type OptionAlias,
  type OptionConfigPrimitiveType,
  type OptionKey,
  type OptionType,
  type OptionValues,
  type OptionsConfig,
  getOptionKeys,
} from 'src/core/options/option';
import {
  type OptionGetter,
  createOptionGetter,
} from 'src/core/options/option-getter';
import { type CamelCase, camelCase } from 'src/utils/camel-case';

/**
 * An object that can be used to dynamically retrieve the values of command
 * options, including aliases. Options can be retrieved by their original key,
 * any of their aliases, or camelCased versions of either.
 *
 * @group Options
 */
export type OptionsGetter<TOptions extends OptionsConfig = OptionsConfig> = {
  [K in keyof TOptions as OptionKey<K, OptionAlias<TOptions[K]>>]: OptionGetter<
    OptionConfigPrimitiveType<TOptions[K]>
  >;
} & {
  /**
   * Get the values of the specified options. This is useful when you want to
   * get the values of multiple options at once.
   *
   * @param optionNames - The names of the options to get.
   *
   * @returns An object with the values of the specified options keyed by both
   * their original keys and camelCased keys.
   */
  get: <
    K extends OptionKey<keyof TOptions, OptionAlias<TOptions[keyof TOptions]>>,
  >(
    ...optionNames: K[]
  ) => Promise<{
    [O in K as O | CamelCase<O>]: OptionConfigPrimitiveType<TOptions[K]>;
  }>;
  /**
   * Direct access to the values of the options, keyed by their original keys,
   * aliases, and camelCased versions of both. This is useful for checking
   * option values without triggering any validation or prompting.
   */
  readonly values: {
    [K in keyof TOptions as OptionKey<
      K,
      OptionAlias<TOptions[K]>
    >]: OptionConfigPrimitiveType<TOptions[K]>;
  };
};

/**
 * Configuration options for the {@linkcode createOptionsGetter} function.
 *
 * @group Options
 */
export interface CreateOptionsGetterOptions<
  TOptionsConfig extends OptionsConfig,
  TOptions extends OptionValues = {},
> {
  /** The options config. */
  optionsConfig: TOptionsConfig;
  /** The initial option values. */
  optionValues?: TOptions;
  /** The client to use for prompting. */
  client?: Client;
  /**
   * A function to call when the user cancels a prompt. By default, this will
   * exit the process.
   */
  onPromptCancel?: () => void;
}

/**
 * Converts command options to a getter object.
 *
 * This function transforms an `Options` object into a `CommandOptionsGetter`
 * object that has getter methods for each of the options. The getters can then
 * be used to retrieve the values of the options dynamically. If an option has
 * defined aliases, the returned getter will have additional getter methods for
 * each alias, all pointing to the original option's value.
 *
 * Additionally, the returned object has a `get` method, which accepts an array
 * of option keys and returns an object with the corresponding camelCased
 * key-value pairs.
 *
 * @example
 * const optionsConfig = {
 *   f: {
 *     type: 'string',
 *     alias: ['foo'],
 *     default: 'default foo'
 *   },
 * };
 * const optionsGetter = createOptionsGetter({ optionsConfig });
 * const val = await optionsGetter.foo(); // 'default foo'
 *
 * @group Options
 */
// TODO: Cache the result of this function
export function createOptionsGetter<
  TKey extends string = string,
  TType extends OptionType = OptionType,
  TOptionsConfig extends OptionsConfig<TKey, TType> = OptionsConfig<
    TKey,
    TType
  >,
  TOptionValues extends OptionValues = OptionValues,
>({
  client = new Client(),
  optionsConfig,
  optionValues = {} as TOptionValues,
  onPromptCancel = process.exit,
}: CreateOptionsGetterOptions<
  TOptionsConfig,
  TOptionValues
>): OptionsGetter<TOptionsConfig> {
  // create a new getter object with the values
  const getter = {
    values: { ...optionValues },

    // getter for all option values
    get: async (...keys: string[]) => {
      const result: Record<string, unknown> = {};
      for (const key of keys) {
        const value = await getter[key]?.();
        result[key] = value;
        result[camelCase(key)] = value;
      }
      return result;
    },
  } as unknown as OptionsGetter;

  // iterate over all keys in the options config
  for (const configKey in optionsConfig) {
    const config = optionsConfig[configKey];
    const optionKeys = getOptionKeys(configKey, config);
    const valueKey = optionKeys.find((key) => key in optionValues);

    // loop through all keys for the option to set values and create getters
    for (const key of optionKeys) {
      getter.values[key] = valueKey
        ? optionValues[valueKey]
        : (config.default as OptionConfigPrimitiveType | undefined);

      const getterFn = createOptionGetter({
        name: key,
        config,
        client,
        value: valueKey ? optionValues[valueKey] : undefined,
        onPromptCancel,
      });

      // wrap the getter function to update the values object
      const wrappedGetterFn = async (...args: Parameters<typeof getterFn>) => {
        const value = await getterFn(...args);
        for (const key of optionKeys) getter.values[key] = value;
        return value;
      };

      getter[key] = wrappedGetterFn;
    }
  }

  return getter as OptionsGetter<TOptionsConfig>;
}
