import { Action } from './actions/action';
import { ClideCommandOptions, ClideOptionType } from './options';
import { ClideParams } from './resolver';
import { ClideState } from './state';
import { MaybePromise } from './utils/types';

export type ClideCommand<
  TData = unknown,
  TParams extends ClideParams = ClideParams,
  TOptions extends ClideCommandOptions = ClideCommandOptions,
> = {
  /**
   * A description of the command.
   */
  description?: string;
  /**
   * If `true`, the command will be executed before the next command in the
   * chain.
   * @default true
   */
  middleware?: boolean;
  /**
   * If `true`, the command will require a subcommand to be executed.
   * @default false
   */
  requiresSubcommand?: boolean;
  /**
   * The options config for the command.
   */
  options?: TOptions;
  /**
   * The command handler. This is where the command's logic is executed.
   */
  handler: ClideCommandHandler<TData, TParams, TOptions>;
} & (
  | {
      requiresSubcommand?: true;
      middleware?: true;
    }
  | {
      requiresSubcommand?: false;
      middleware?: boolean;
    }
);

/**
 * Factory function to create a ClideCommand object with strong typing. This is
 * used to define a command with its associated metadata, options, and handler
 * logic.
 *
 * The function is generic and can be used to define a command with custom
 * types, but it's recommended to allow TypeScript to infer the types based on
 * the options passed to the function.
 *
 * @template TData - Optional type for data specific to this command.
 * @template TParams - The type for any parameters passed to the command.
 * @template TOptionsKey - The string keys representing option names.
 * @template TOptionsType - The Clide option type (e.g., 'string', 'number').
 * @template TOptions - The type that represents all options for the command.
 * @template TRequiresSubcommand - A boolean that signifies if the command
 * requires a subcommand.
 *
 * @param options - The properties for constructing a ClideCommand.
 *
 * @returns A constructed ClideCommand object with strong types.
 */
export function command<
  TData = unknown,
  TParams extends ClideParams = ClideParams,
  TOptionsKey extends string = string,
  TOptionsType extends ClideOptionType = ClideOptionType,
  TOptions extends ClideCommandOptions<
    TOptionsKey,
    TOptionsType
  > = ClideCommandOptions<TOptionsKey, TOptionsType>,
>({
  description,
  requiresSubcommand = false,
  middleware = true,
  options,
  handler,
}: ClideCommand<TData, TParams, TOptions>) {
  return {
    description,
    requiresSubcommand,
    middleware,
    options,
    handler,
  };
}

export type ClideCommandHandler<
  TData = unknown,
  TParams extends ClideParams = ClideParams,
  TOptions extends ClideCommandOptions = ClideCommandOptions,
> = (
  state: Readonly<ClideState<TData, TParams, TOptions>>,
) => MaybePromise<Action>;
