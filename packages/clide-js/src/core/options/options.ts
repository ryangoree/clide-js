import { type CamelCase, camelCase } from 'src/utils/camel-case';
import type {
  Eval,
  KeyWithMatchingValue,
  MaybeReadonly,
  Merge,
  Replace,
} from 'src/utils/types';

// Types //

/**
 * The primitive types for each option type.
 *
 * This is used to map each option type to its corresponding primitive type.
 * Using [`declaration merging`](https://www.typescriptlang.org/docs/handbook/declaration-merging.html),
 * the types can be altered to make types more specific or extended for custom
 * option types.
 *
 * @example
 * ```ts
 * declare module 'clide-js' {
 *   interface OptionPrimitiveTypeMap {
 *     number: 0 | 1;
 *     custom: CustomType;
 *   }
 * }
 * ```
 *
 * @group Options
 */
export interface OptionPrimitiveTypeMap extends _OptionPrimitiveTypeMap {}
type _OptionPrimitiveTypeMap = {
  string: string;
  secret: string;
  number: number;
  boolean: boolean;
  array: string[];
};

/**
 * The possible types for an option.
 *
 * @group Options
 */
export type OptionType = keyof OptionPrimitiveTypeMap;

/**
 * A custom option type that extends the base option types.
 *
 * @group Options
 */
export type CustomOptionType<T extends OptionType> =
  | T
  | KeyWithMatchingValue<OptionPrimitiveTypeMap, T>;

export type BuiltInOptionType<T extends OptionType = OptionType> =
  T extends keyof _OptionPrimitiveTypeMap
    ? T
    : KeyWithMatchingValue<OptionPrimitiveTypeMap, T, _OptionPrimitiveTypeMap>;

/**
 * Get the primitive type for an option type.
 *
 * @group Options
 */
export type OptionPrimitiveType<T extends OptionType = OptionType> =
  OptionPrimitiveTypeMap[T];

/**
 * Get the argument type for an option considering the  number of arguments it
 * accepts.
 */
export type OptionArgumentType<
  T extends OptionType = OptionType,
  TNargs extends number | undefined = undefined,
> = TNargs extends number
  ? TNargs extends 0 | 1
    ? OptionPrimitiveType<T>
    : OptionPrimitiveType<T> extends infer T extends OptionPrimitiveType
      ? T extends readonly any[]
        ? T
        : T[]
      : never
  : OptionPrimitiveType<T>;

/**
 * The configuration interface for an option used to define how an option will
 * be parsed and validated.
 *
 * @group Options
 */
export type OptionConfig<
  T extends OptionType = OptionType,
  TAlias extends string = string,
> = T extends T
  ? {
      /** One or more aliases for the option (optional). */
      alias?: MaybeReadonly<TAlias[]>;
      /**
       * The custom type registered with {@linkcode OptionPrimitiveTypeMap}.
       */
      type: BuiltInOptionType<T>;
      /** The custom type of the option. */
      customType?: CustomOptionType<T>;
      /**
       * The valid choices for the option (optional). If provided, the getter
       * will validate the value against the choices and, unless otherwise
       * specified, will use the choices when prompting.
       */
      choices?: string[];
      /**
       * Whether the option is a string (optional, inferred from `type`). Useful
       * for array options to specify the type of the array values.
       */
      string?: boolean;
      /** The number of arguments the option accepts (optional). */
      nargs?: number;
      /** The description of the option (optional, has default based on `name`). */
      description?: string;
      /**
       * The default value to use. This will be the initial value that the getter
       * prompt will show (optional).
       */
      // FIXME: This should be OptionConfigPrimitiveType, but referencing `this` in
      // the getter causes excessively deep type recursion.
      default?: MaybeReadonly<OptionPrimitiveType<T>>;
      /**
       * Whether the option is required. If `true`, the getter will throw an error
       * if no value is provided (optional).
       */
      required?: boolean;
      /** Other options that are required for this option to be used (optional). */
      requires?: MaybeReadonly<string[]>;
      /** Other options that are mutually exclusive with this option (optional). */
      conflicts?: MaybeReadonly<string[]>;

      /** The autocomplete function (optional). */
      // TODO: Not implemented yet
      // autoComplete?: (input: string) => MaybePromise<string[]>;
      // autoComplete?: [
      //   // potential values, engine will manage matching
      // ]
    }
  : never;

export type OptionConfigType<T extends OptionConfig> =
  T['customType'] extends OptionType ? T['customType'] : T['type'];

/**
 * Get the primitive type for an option considering it's config.
 */
export type OptionConfigPrimitiveType<T extends OptionConfig = OptionConfig> =
  T extends OptionConfig
    ? T['required'] extends true
      ? OptionArgumentType<
          OptionConfigType<T>,
          'nargs' extends keyof T ? T['nargs'] : undefined
        >
      : T['default'] extends MaybeReadonly<
            OptionArgumentType<OptionConfigType<T>>
          >
        ? OptionArgumentType<
            OptionConfigType<T>,
            'nargs' extends keyof T ? T['nargs'] : undefined
          >
        :
            | OptionArgumentType<
                OptionConfigType<T>,
                'nargs' extends keyof T ? T['nargs'] : undefined
              >
            | undefined
    : undefined;

/**
 * Get a union of all aliases for an option.
 *
 * @group Options
 */
export type OptionAlias<T extends OptionConfig> = T extends {
  alias: string[];
}
  ? T['alias'][number]
  : never;

/**
 * The options config for a command.
 *
 * @group Options
 */
export type OptionsConfig<
  TKey extends string = string,
  TType extends OptionType = OptionType,
> = Record<TKey, OptionConfig<TType, TKey>>;

/**
 * A key for an option, including the option key, aliases, and camelCased
 * versions of each.
 */
export type OptionKey<
  TKey extends PropertyKey = string,
  TAlias extends string = string,
> = TKey | TAlias | CamelCase<TKey | TAlias>;

/**
 * An expanded {@linkcode OptionsConfig} in which each option's config
 * accessible by any of its keys or aliases.
 *
 * @group Options
 */
export type ExpandedOptionsConfig<T extends OptionsConfig> =
  Merge<T> extends infer TMerged extends OptionsConfig
    ? {
        [K in keyof TMerged as OptionKey<K, OptionAlias<TMerged[K]>>]: Eval<
          Replace<
            TMerged[K],
            TMerged[K]['alias'] extends string[]
              ? {
                  alias: [...TMerged[K]['alias'], `${K & string}`];
                }
              : {}
          >
        >;
      }
    : Record<string, OptionConfig>;

/**
 * The values for each option.
 * @group Options
 */
export type OptionValues<TOptions extends OptionsConfig = OptionsConfig> =
  Merge<TOptions> extends infer TMerged extends OptionsConfig
    ? Eval<{
        [K in keyof TMerged as OptionKey<
          K,
          OptionAlias<TMerged[K]>
        >]?: OptionConfigPrimitiveType<TMerged[K]>;
      }>
    : Record<string, OptionPrimitiveType | undefined>;

// Functions //

/**
 * Factory function to create an {@linkcode OptionConfig} object with strong typing.
 *
 * @param config - The config for the option.
 *
 * @group Options
 */
export function option<const T extends OptionConfig = OptionConfig>(config: T) {
  return config;
}

/**
 * Factory function to create an {@linkcode OptionsConfig} object with strong typing.
 *
 * @param config - The config for the options.
 *
 * @group Options
 */
export function options<const T extends OptionsConfig = OptionsConfig>(
  config: T,
) {
  return config;
}

/**
 * Infer the option type from a value, defaulting to 'string'.
 *
 * @param value - The value to infer the type from.
 *
 * @returns - An option type for the value.
 *
 * @group Options
 */
export function getOptionTypeFromValue<T>(value: T): OptionType {
  switch (typeof value) {
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'object':
      return 'array';
    default:
      return 'string';
  }
}

/**
 * Get all keys for an option, including the option key, aliases, and
 * camelCased versions of each.
 *
 * @param configKey - The option's key in the command's options config.
 * @param config - The option's config entry.
 *
 * @group Options
 */
export function getOptionKeys(configKey: PropertyKey, config: OptionConfig) {
  const allKeysForOption = [String(configKey), ...(config.alias || [])];
  return [
    ...allKeysForOption,
    ...allKeysForOption.map((key) => camelCase(key)),
  ];
}

/**
 * Get a display name for an option by checking it's key and aliases for a name
 * longer than one character, falling back to the key.
 *
 * @param configKey - The option's key in the command's options config.
 * @param config - The option's config entry.
 *
 * @group Options
 */
export function getOptionDisplayName(
  configKey: string,
  config: OptionConfig | undefined,
) {
  if (configKey.length > 1) return configKey;
  return config?.alias?.find((alias) => alias.length > 1) || configKey;
}
