import { Action } from './actions/action';
import { end } from './actions/end';
import { next } from './actions/next';
import { result } from './actions/result';
import { ClideClient } from './client';
import { ClideCommandHandler } from './command';
import { ClideEmitter } from './emitter';
import { aliasedOptionsGetter, optionsGetter } from './options';
import { ClidePlugin } from './plugins';
import { ResolvedCommand, resolveCommand } from './resolver';
import { ClideState } from './state';
import { deepFreezeClone } from './utils/deep-freeze-clone';
import { Options, Tokens } from './parse';

export interface ExecuteOptions {
  /**
   * An array of command handlers to be executed.
   */
  steps?: ClideCommandHandler[];
  /**
   * The tokens extracted from the user's input. Represents commands,
   * subcommands, or parameters.
   */
  tokens: Tokens;
  /**
   * Event emitter for the Clide engine.
   */
  emitter: ClideEmitter;
  /**
   * The client instance associated with the command execution.
   */
  client: ClideClient;
  /**
   * Parsed options from the command input.
   */
  options?: Options;
  /**
   * The metadata from all initialized plugins.
   */
  plugins?: ClidePlugin['meta'][];
  /**
   * Initial data context for the command execution. This will be passed to the
   * first command handler.
   */
  initialData?: unknown;
}

/**
 * Orchestrates the execution of a sequence of command handlers based on
 * provided options.The function processes each command handler in the steps
 * until an action that does not require further execution is returned or all
 * steps are processed.
 *
 * @template T - The type of the final result after executing all the steps.
 *
 * @param steps - An array of command handlers to be executed.
 * @param executeOptions - Configuration and context required for executing the
 * commands.
 *
 * @returns The final result after executing all the steps. The type depends on
 * the sequence of command handlers and the data they return.
 */
export async function execute<T>({
  steps,
  tokens,
  options = {},
  emitter,
  client,
  plugins = [],
  initialData,
}: ExecuteOptions): Promise<T> {
  // TODO: Consider simplifying state to only be the static data and the
  // dynamic data (i.e. params, options, etc.)
  const state: ClideState = {
    i: -1,
    tokens,
    plugins,
    data: initialData,
    params: {},
    emitter,
    client,
    options: optionsGetter(options),
    end,
    next,
    result,
  };

  let finalResult: unknown = next(initialData);

  const _steps =
    steps ||
    (await getExecutionSteps({
      tokens,
      commandsDir: './commands',
      client,
    }));

  // TODO: Add guards to prevent infinite loops
  while (isAction(finalResult)) {
    finalResult = await finalResult.execute(_steps, state);
  }

  return finalResult as T;
}

interface GetExecutionStepsOptions {
  /**
   * The tokenized command input, which determines the sequence of command
   * handlers.
   */
  tokens: Tokens;
  /**
   * Path to the directory containing clide command implementations.
   */
  commandsDir: string;
  /**
   * The client object that will be passed to the command handlers.
   */
  client: any;
}

/**
 * Generates a list of command execution steps from provided tokens by loading
 * corresponding command handlers. Each step is a function that
 *  - adds the token's params and option getter to the state
 *  - executes the command handler with the updated state
 *
 * This function starts with resolving the initial command based on the provided
 * tokens. If the resolved command is middleware or doesn't require resolving
 * the next command, its handler is added to the steps. Otherwise, if there are
 * params associated with the resolved command but no handler, it creates a step
 * to just assign those params and move to the next command.
 *
 * The process repeats until there are no more commands to resolve.
 *
 * @param tokens - The tokenized command input, which determines the sequence of
 * command handlers.
 * @param commandsDir - Path to the directory containing clide command
 * implementations.
 *
 * @returns An ordered list of command handlers representing steps to execute
 * the given command.
 *
 * @example
 * const steps = await getExecutionSteps(['build', './src'], './commands');
 */
export async function getExecutionSteps({
  tokens,
  commandsDir,
  client,
}: GetExecutionStepsOptions): Promise<ClideCommandHandler[]> {
  const steps: ClideCommandHandler[] = [];
  let resolved: ResolvedCommand | undefined = await resolveCommand(
    tokens,
    commandsDir,
  );

  while (resolved) {
    const {
      command: { handler, middleware, options },
      params,
    } = resolved;

    if (middleware || !resolved.resolveNext) {
      steps.push((state) => {
        Object.assign(state.params, params);
        if (options) {
          Object.assign(
            state.options,
            aliasedOptionsGetter({
              options,
              originalGetter: state.options,
              client,
            }),
          );
        }
        return handler(deepFreezeClone(state));
      });
    } else if (params) {
      steps.push((state) => {
        Object.assign(state.params, params);
        return state.next(state.data);
      });
    }

    resolved = await resolved.resolveNext?.();
  }

  return steps;
}

function isAction(maybeAction: unknown): maybeAction is Action {
  return (
    !!maybeAction &&
    typeof maybeAction === 'object' &&
    'execute' in maybeAction &&
    typeof maybeAction?.execute === 'function'
  );
}
