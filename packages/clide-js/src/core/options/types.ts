import { PromptOptions } from 'src/core/client';
import { MaybeReadonly } from 'src/utils/types';

/**
 * The possible types for an option.
 * @group Options
 */
export type OptionType = 'string' | 'number' | 'boolean' | 'array';

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
  /** The number of arguments the option accepts (optional). */
  nargs?: number;
  /** The description of the option (optional, has default based on `name`). */
  description?: string;
  /** The prompt to show the user if no value is provided (optional). */
  prompt?: string | PromptOptions;
  /**
   * The default value to use. This will be the initial value that the getter
   * prompt will show (optional).
   */
  default?: MaybeReadonly<OptionPrimitiveType<T>>;
  /**
   * Prompts the user for the option if it's not present and requires the
   * user enters a valid value. If no `prompt` field is provided, a default
   * will be used based on `name`.
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
 * Get the primitive type for an option type.
 * @group Options
 */
export type OptionPrimitiveType<T extends OptionType = OptionType> =
  T extends 'string'
    ? string
    : T extends 'number'
    ? number
    : T extends 'boolean'
    ? boolean
    : T extends 'array'
    ? string[]
    : never;
