import type { MaybeReadonly } from 'src/utils/types';

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
 * @group Options
 */
export type OptionType = keyof OptionPrimitiveTypeMap;

/**
 * Get the primitive type for an option type.
 * @group Options
 */
export type OptionPrimitiveType<T extends OptionType = OptionType> =
  OptionPrimitiveTypeMap[T];

/**
 * The configuration interface for an option used to define how an option will
 * be parsed and validated.
 * @group Options
 */
export interface OptionConfig<
  T extends OptionType = OptionType,
  TAlias extends string = string,
> {
  /** One or more aliases for the option (optional). */
  alias?: MaybeReadonly<TAlias[]>;
  /** The type of the option. */
  type: T;
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

/**
 * The options config for a command.
 * @group Options
 */
export type OptionsConfig<
  TKey extends string = string,
  TType extends OptionType = OptionType,
> = Record<TKey, OptionConfig<TType, TKey>>;

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
