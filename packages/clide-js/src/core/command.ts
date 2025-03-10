import type { OptionsConfig } from 'src/core/options/options';
import type { State } from 'src/core/state';
import type { MaybePromise } from 'src/utils/types';

/**
 * A command module that can be executed by the CLI engine.
 * @typeParam TData - Optional type for data specific to this command.
 * @typeParam TOptions - The `OptionsConfig` type for the command.
 * @group Command
 */
export type CommandModule<
  TData = unknown,
  TOptions extends OptionsConfig = OptionsConfig,
> = {
  /**
   * A description of the command that will be displayed in the help menu.
   */
  description?: string;
  /**
   * If `true`, the command will be executed before the next command in the
   * chain.
   * @default true
   */
  isMiddleware?: boolean;
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
  handler: CommandHandler<TData, TOptions>;
};

/**
 * Factory function to create a Command object with strong typing. This is used
 * to define a command with its associated metadata, options, and handler logic.
 *
 * @typeParam TData - Optional type for data specific to this command.
 * @typeParam TOptions - The `OptionsConfig` type that represents all options
 * for the command.
 *
 * @param options - The config for constructing the Command.
 *
 * @returns A constructed `Command` object with strong types.
 * @group Command
 */
export function command<
  TData = unknown,
  const TOptions extends OptionsConfig = OptionsConfig,
>({
  // Apply defaults
  requiresSubcommand = false,
  isMiddleware = true,
  options = {} as TOptions,
  handler,
  description = '',
}: CommandModule<TData, TOptions>) {
  const mod = {
    requiresSubcommand,
    isMiddleware,
    options,
    handler,
    description,
  };

  if (!mod.handler) {
    Object.assign(mod, passThroughCommand);
  }

  return mod;
}

/**
 * A command handler function that receives the current state and performs some
 * action.
 * @typeParam TData - Optional type for data specific to this command.
 * @typeParam TOptions - The `OptionsConfig` type for the command.
 * @param state - The current state of the CLI engine.
 * @group Command
 */
export type CommandHandler<
  TData = unknown,
  TOptions extends OptionsConfig = OptionsConfig,
> = (state: Readonly<State<TData, TOptions>>) => MaybePromise<unknown>;

/**
 * A command handler that simply passes the data to the next command in the
 * chain, requiring a subcommand to pass the data to.
 * @group Command
 */
export const passThroughCommand: CommandModule = {
  handler: async ({ next, data }) => next(data),
  requiresSubcommand: true,
};
