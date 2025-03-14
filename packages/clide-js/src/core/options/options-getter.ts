import { Client } from 'src/core/client';
import type { OptionValues } from 'src/core/parse';
import { type CamelCase, camelCase } from 'src/utils/camel-case';
import type { MaybeReadonly } from 'src/utils/types';
import type {
  OptionConfig,
  OptionPrimitiveType,
  OptionType,
  OptionsConfig,
} from './option';
import { type OptionGetter, createOptionGetter } from './option-getter';

/**
 * Configuration options for the {@linkcode createOptionsGetter} function.
 * @group Options
 */
interface CreateOptionsGetterOptions<
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
 * This function transforms an `Options` object into a
 * `CommandOptionsGetter` object that has getter methods for each of the
 * options. The getters can then be used to retrieve the values of the options
 * dynamically. If an option has defined aliases, the returned getter will have
 * additional getter methods for each alias, all pointing to the original
 * option's value.
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
      // get the value for each key
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
    // get the config for the option's key
    const config = optionsConfig[configKey];

    // get all keys for the option, including the option key, aliases, and
    // camelCased versions of each
    let allKeysForOption: string[] = [configKey, ...(config.alias || [])];
    allKeysForOption = [
      ...allKeysForOption,
      ...allKeysForOption.map((key) => camelCase(key)),
    ];

    // loop through the keys once to find the first one with an entry in
    // optionValues
    let keyWithValue: string | undefined;
    for (const key of allKeysForOption) {
      if (key in optionValues) {
        keyWithValue = key;
        break;
      }
    }

    // loop through the keys again to set values and create getters
    for (const key of allKeysForOption) {
      // set values
      // to be set if there was a keyWithValue?
      getter.values[key] = keyWithValue
        ? optionValues[keyWithValue]
        : (config.default as OptionPrimitiveType | undefined);

      // create a getter fn for the key
      const getterFn = createOptionGetter({
        name: key,
        config,
        client,
        value: keyWithValue ? optionValues[keyWithValue] : undefined,
        onPromptCancel,
      });

      // wrap the getter function to update the values object
      const wrappedGetterFn = async (...args: Parameters<typeof getterFn>) => {
        const value = (await getterFn(...args)) as OptionPrimitiveType;
        for (const key of allKeysForOption) {
          getter.values[key] = value;
        }
        return value;
      };

      getter[key] = wrappedGetterFn;
    }
  }

  return getter as OptionsGetter<TOptionsConfig>;
}

/**
 * An object that can be used to dynamically retrieve the values of command
 * options, including aliases. Options can be retrieved by their original key,
 * any of their aliases, or camelCased versions of either.
 * @group Options
 */
export type OptionsGetter<TOptions extends OptionsConfig = OptionsConfig> = {
  [K in keyof TOptions as
    | K
    | OptionAlias<TOptions[K]>
    | CamelCase<K | OptionAlias<TOptions[K]>>]: OptionGetter<
    CommandOptionType<TOptions[K]>
  >;
} & {
  /**
   * Get the values of the specified options. This is useful when you want to
   * get the values of multiple options at once.
   * @param optionNames - The names of the options to get.
   * @returns An object with the values of the specified options keyed by
   * both their original keys and camelCased keys.
   */
  get<K extends keyof TOptions | OptionAlias<TOptions[keyof TOptions]>>(
    ...optionNames: K[]
  ): Promise<{
    [O in K as O | CamelCase<O>]: CommandOptionsTypes<TOptions>[O];
  }>;
  /**
   * Direct access to the values of the options, keyed by their original keys,
   * aliases, and camelCased versions of both. This is useful for checking
   * option values without triggering any validation or prompting.
   */
  readonly values: {
    [K in keyof TOptions as
      | K
      | OptionAlias<TOptions[K]>
      | CamelCase<K | OptionAlias<TOptions[K]>>]: CommandOptionType<
      TOptions[K]
    >;
  };
};

/**
 * Get a union of all aliases for an option.
 * @group Options
 */
export type OptionAlias<T extends OptionConfig> = T extends {
  alias: string[];
}
  ? T['alias'][number]
  : never;

/**
 * Get the primitive type for an option considering whether it is required or
 * has a default value. If neither is true, the type is the primitive type
 * unioned with `undefined`.
 */
type CommandOptionType<T extends OptionConfig> = T['required'] extends true
  ? OptionPrimitiveType<T['type']>
  : T['default'] extends MaybeReadonly<OptionPrimitiveType<T['type']>>
    ? OptionPrimitiveType<T['type']>
    : OptionPrimitiveType<T['type']> | undefined;

/**
 * Get the primitive type for each option in an options config.
 */
type CommandOptionsTypes<T extends OptionsConfig> = {
  [K in keyof T]: CommandOptionType<T[K]>;
} & {
  [K in keyof T as OptionAlias<T[K]>]: CommandOptionType<T[K]>;
};
