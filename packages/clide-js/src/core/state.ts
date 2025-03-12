import type { CommandModule } from 'src/core/command';
import type { Context } from 'src/core/context';
import { ClideError } from 'src/core/errors';
import type { OptionValues, OptionsConfig } from 'src/core/options/options';
import {
  type OptionsGetter,
  createOptionsGetter,
} from 'src/core/options/options-getter';
import type { Params, ResolvedCommand } from 'src/core/resolve';

// Types //

/**
 * A partial state object containing only the properties that can be modified
 * during a state transition, used to pass state changes to hooks.
 * @group State
 */
export interface NextState {
  i?: number;
  data?: unknown;
  params?: Params;
  options?: OptionValues;
}

// Classes + Class Types //

interface StateParams<TData = unknown> {
  /** The context for the command. */
  context: Context;
  /** The initial data for the steps. */
  initialData?: TData;
  /**
   * The commands to execute. If not provided, it defaults to the commands
   * resolved from the context.
   */
  commands?: ResolvedCommand[];
  /**
   * The options config to use when creating the options getter. If not
   * provided, it defaults to the options config from the context.
   */
  options?: OptionsConfig;
  /**
   * The option values to use when creating the options getter. If not provided,
   * it defaults to the parsed options from the context.
   */
  optionValues?: OptionValues;
}

/**
 * Execution state management.
 *
 * The `State` is responsible for managing the state of command execution. It
 * provides mechanisms to progress through command execution, handle state
 * transitions, and manage the lifecycle of command data.
 *
 * @group State
 */
export class State<
  TData = unknown,
  TOptions extends OptionsConfig = OptionsConfig,
> {
  /**
   * The number of times `next()` or `end()` have been called. This is used to
   * prevent the process from hanging if a command handler neglects to call
   * `next()` or `end()`. If the action call count doesn't align with the
   * expected count based on the number of steps, the next step will be called
   * automatically.
   */
  #actionCallCount = 0;
  #context: Context;
  #data: TData;
  #i = -1;
  #commands: ResolvedCommand[];
  #options: OptionsGetter;
  #params: Params = {};

  /**
   * A promise that resolves when the steps are done. This is useful for
   * ensuring that all steps have completed without requiring each handler to
   * worry about awaiting the next step or returning a promise.
   */
  #executionPromise: Promise<void> | undefined;
  /** A function that resolves the promise when called. */
  #resolvePromise: (() => void) | undefined;

  constructor({
    context,
    initialData,
    commands,
    options = context.options,
    optionValues = context.parsedOptions,
  }: StateParams<TData>) {
    this.#context = context;
    this.#data = initialData as TData;
    this.#commands = commands || context.resolvedCommands;

    // Create a getter to dynamically get the options from context.
    this.#options = createOptionsGetter({
      client: context.client,
      optionsConfig: options,
      optionValues: optionValues,
      onPromptCancel: context.exit,
    });
  }

  /** The current step index. */
  get i() {
    return this.#i;
  }
  /** The current command. */
  get command() {
    return this.commands[this.i];
  }
  /** The commands that will be executed. */
  get commands() {
    return this.#commands;
  }
  /** The context for the command. */
  get context() {
    return this.#context;
  }
  /** The current data. */
  get data() {
    return this.#data;
  }
  /** The current params, including params from previous steps. */
  get params() {
    return this.#params;
  }
  /** An `OptionsGetter` to dynamically retrieve options. */
  get options() {
    return this.#options as OptionsGetter<TOptions>;
  }
  /** The client for the command. */
  get client() {
    return this.context.client;
  }

  /**
   * Start the steps.
   * @throws {ClideError} If the steps have already started.
   * @returns A promise that resolves when the steps are done.
   */
  readonly start = async (initialData: unknown = this.#data): Promise<void> => {
    // Avoid starting the steps if they're already started.
    if (this.#executionPromise) {
      throw new ClideError('Steps have already started.');
    }

    // Create a promise that will resolve when the steps are done.
    this.#executionPromise = new Promise((resolve) => {
      this.#resolvePromise = resolve;
    });

    // Start the steps.
    await this.next(initialData);

    // Return the promise so that the caller can wait for the steps to complete.
    return this.#executionPromise.then(() => {
      // Reset the promise and resolve function so that the steps can be started
      // again.
      this.#executionPromise = undefined;
      this.#resolvePromise = undefined;
    });
  };

  /**
   * Modify the data and continue to the next step if there is one, otherwise
   * return the data.
   * @param data The data to pass to the next step or return.
   */
  readonly next = async (data?: unknown): Promise<void> => {
    this.#actionCallCount++;
    let _data = data;
    const nextIndex = this.i + 1;
    let nextCommand = this.commands[nextIndex] as ResolvedCommand | undefined;

    await this.context.hooks.call('beforeNext', {
      state: this,
      data,
      setData: (data) => {
        _data = data;
      },
      nextCommand,
      setNextCommand: (command) => {
        nextCommand = command;
      },
    });

    if (nextCommand) {
      // If there is a next command, increment the step index and call the
      // command handler.
      await this.#applyState({
        data: _data,
        i: nextIndex,
        // Merge params from previous steps with params from the next command.
        params: {
          ...this.params,
          ...nextCommand.params,
        },
      });

      const actionCallCountBefore = this.#actionCallCount;
      await nextCommand.command.handler(this);

      // Prevent the process from hanging if a command handler neglects to call
      // `next()` or `end()` by checking if the action call count has changed.
      if (actionCallCountBefore === this.#actionCallCount) {
        await this.next(_data);
      }
    } else {
      // If there is no next command, end the steps.
      await this.#applyState({
        data: _data,
      });

      // Resolve the promise to return the data to callers of `start()`.
      this.#resolvePromise?.();
    }
  };

  /**
   * Return data and end the steps.
   * @param data The data to return.
   */
  readonly end = async (
    data?: unknown,
    // endOptions: EndOptions = {},
  ): Promise<void> => {
    this.#actionCallCount++;
    let _data = data;

    await this.context.hooks.call('beforeEnd', {
      state: this,
      data,
      setData: (data) => {
        _data = data;
      },
    });

    // TODO: Re-think this. It could be implemented as a plugin/hook.
    // const nextCommand = this.commands[this.i + 1] as
    //   | ResolvedCommand
    //   | undefined;

    // if (nextCommand && (endOptions.warning || endOptions.error)) {
    //   if (endOptions.warning) {
    //     this.context.client.warn(endOptions.warning);
    //   }
    //   if (endOptions.error) {
    //     throw new UsageError(endOptions.error);
    //   }

    //   this.context.client.warn(
    //     'Ending prematurely, remaining steps will be skipped.',
    //   );
    // }

    await this.#applyState({
      data: _data,
      i: this.commands.length - 1,
    });

    // Resolve the promise to return the data to callers of `start()`.
    if (this.#resolvePromise) {
      this.#resolvePromise();
    }
  };

  /**
   * Fork the state and execute a new set of commands with the same context.
   * @returns The data from the last command.
   */
  readonly fork = async <TCommand extends CommandModule<any, any>>({
    commands,
    initialData = this.data,
    optionValues,
    paramValues,
  }: {
    commands: (TCommand | ResolvedCommand)[];
    initialData?: unknown;
    optionValues?: OptionValues<
      TCommand['options'] extends OptionsConfig
        ? TCommand['options']
        : OptionsConfig
    >;
    // TODO: strict type for paramValues
    paramValues?: Params;
  }) => {
    const resolvedCommands: ResolvedCommand[] = [];
    const resolvedCommandsOptions: OptionsConfig = {};

    for (const command of commands) {
      let resolved: ResolvedCommand | undefined;

      if ('command' in command) {
        resolved = command;
      } else {
        resolved = {
          command,
          commandName: 'fork-command',
          remainingCommandString: '',
          commandPath: '',
          commandTokens: [],
          subcommandsDir: '',
          params: paramValues,
        };
      }

      Object.assign(resolvedCommandsOptions, resolved.command.options);
      resolvedCommands.push(resolved);
    }

    // Create a new state for the invocation
    const state = new State({
      context: this.context,
      initialData: initialData,
      commands: resolvedCommands,
      options: {
        ...this.context.options,
        ...resolvedCommandsOptions,
      },
      optionValues: this.options.values,
    });

    // Override options with the provided values
    if (optionValues) {
      for (const [key, value] of Object.entries(optionValues)) {
        state.options.set(key, value);
      }
    }

    await state.start(initialData);
    return state.data;
  };

  /**
   * Set new state values.
   * @param nextState The next state values to set.
   */
  // Should be called every state change.
  async #applyState(nextState: Partial<NextState>) {
    let _changes = nextState;

    // pre hook
    await this.context.hooks.call('beforeStateChange', {
      state: this,
      changes: _changes,
      setChanges: (changes: Partial<NextState>) => {
        _changes = changes;
      },
      skip: () => {
        this.context.client.warn(
          `Skipping state update. Next state: ${JSON.stringify(
            _changes,
            null,
            2,
          )}`,
        );
        _changes = {};
      },
    });

    // Set new state values if defined.
    if (_changes.i !== undefined) {
      this.#i = _changes.i;
    }
    if (_changes.params !== undefined) {
      this.#params = _changes.params;
    }
    if (_changes.options !== undefined) {
      Object.assign(this.#options.values, _changes.options);
    }

    // Data can be undefined, so we simply check if the key exists.
    if ('data' in _changes) {
      this.#data = _changes.data as TData;
    }

    // post hook
    await this.context.hooks.call('afterStateChange', {
      state: this,
      changes: _changes,
    });
  }
}

// export interface EndOptions {
//   warning?: string;
//   error?: string;
// }
