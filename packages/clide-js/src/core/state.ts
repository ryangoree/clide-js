import { Context } from './context';
import { ClideError } from './errors';
import { OptionsGetter, createOptionsGetter } from './options/options-getter';
import { OptionsConfig } from './options/types';
import { OptionValues } from './parse';
import { Params, ResolvedCommand } from './resolve';

interface StateOptions<TData = unknown> {
  /** The context for the command. */
  context: Context;
  /** The initial data for the steps. */
  data?: TData;
}

/**
 * Execution state management.
 *
 * The `State` is responsible for managing the state of command execution.
 * It provides mechanisms to progress through command execution, handle state
 * transitions, and manage the lifecycle of command data.
 *
 * @group State
 */
export class State<
  TData = unknown,
  TOptions extends OptionsConfig = OptionsConfig,
> {
  private _context: Context;
  private _data: TData;
  private _i = -1;
  private _commands: ResolvedCommand[];
  private _options: OptionsGetter<TOptions>;
  private _params: Params = {};

  /**
   * A promise that resolves when the steps are done. This is useful for
   * ensuring that all steps have completed without requiring each handler to
   * worry about awaiting the next step or returning a promise.
   */
  private _promise: Promise<void> | undefined;
  /** A function that resolves the promise when called. */
  private _resolvePromise: ((value: void) => void) | undefined;

  constructor({ context, data }: StateOptions<TData>) {
    this._context = context;
    this._data = data as TData;
    this._commands = this._context.resolvedCommands;

    // Create a getter to dynamically get the options from context.
    this._options = createOptionsGetter({
      client: this._context.client,
      optionsConfig: this._context.options,
      optionValues: this._context.parsedOptions,
    }) as OptionsGetter<TOptions>;
  }

  /** The current step index. */
  get i() {
    return this._i;
  }
  /** The current command. */
  get command() {
    return this.commands[this.i];
  }
  /** The commands that will be executed. */
  get commands() {
    return this._commands;
  }
  /** Whether the steps are done. */
  get isDone() {
    return this.i >= this.commands.length - 1;
  }
  /** The context for the command. */
  get context() {
    return this._context;
  }
  /** The current data. */
  get data() {
    return this._data;
  }
  /** The current params, including params from previous steps. */
  get params() {
    return this._params;
  }
  /** An `OptionsGetter` to dynamically retrieve options. */
  get options() {
    return this._options;
  }

  /**
   * Start the steps.
   * @throws {ClideError} If the steps have already started.
   * @returns A promise that resolves when the steps are done.
   */
  start = async (initialData?: unknown): Promise<void> => {
    // Avoid starting the steps if they're already started.
    if (this._promise) {
      throw new ClideError('Steps have already started.');
    }

    // Create a promise that will resolve when the steps are done.
    this._promise = new Promise((resolve) => {
      this._resolvePromise = resolve;
    });

    // Start the steps.
    await this.next(initialData);

    // Return the promise so that the caller can wait for the steps to complete.
    return this._promise.then(() => {
      // Reset the promise and resolve function so that the steps can be
      // started again.
      this._promise = undefined;
    });
  };

  /**
   * Modify the data and continue to the next step if there is one, otherwise
   * return the data.
   * @param data The data to pass to the next step or return.
   */
  readonly next = async (data?: unknown): Promise<void> => {
    let _data = data;
    let nextCommand = this.commands[this.i + 1] as ResolvedCommand | undefined;

    await this.context.hooks.call('preNext', {
      state: this as any,
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
      await this._setState({
        data: _data as any,
        i: this.i + 1,
        // Merge params from previous steps with params from the next command.
        params: {
          ...this.params,
          ...nextCommand.params,
        },
      });

      await nextCommand.command.handler(this);
    } else {
      // If there is no next command, end the steps.
      await this._setState({
        data: _data as any,
      });

      // Resolve the promise to return the data to callers of `start()`.
      if (this._resolvePromise) {
        this._resolvePromise();
      }
    }
  };

  /**
   * Return data and end the steps.
   * @param data The data to return.
   *
   * @throws {UsageError} If an error is provided and the step is not the last.
   */
  readonly end = async (
    data?: unknown,
    // endOptions: EndOptions = {},
  ): Promise<void> => {
    let _data = data as any;

    await this.context.hooks.call('preEnd', {
      state: this as any,
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

    await this._setState({
      data: _data,
      i: this.commands.length - 1,
    });

    // Resolve the promise to return the data to callers of `start()`.
    if (this._resolvePromise) {
      this._resolvePromise();
    }
  };

  /**
   * Set new state values.
   * @param nextState The next state values to set.
   */
  // Should be called every state change.
  private async _setState(nextState: Partial<NextState>) {
    let _changes = nextState;

    await this.context.hooks.call('preStateChange', {
      state: this as any,
      changes: _changes,
      setChanges: (changes: Partial<NextState>) => {
        _changes = changes;
      },
      skip: () => {
        this.context.client.warn('State change cancelled.');
      },
    });

    if (_changes.i !== undefined) {
      this._i = _changes.i;
    }
    if (_changes.params !== undefined) {
      this._params = _changes.params as any;
    }
    if (_changes.options !== undefined) {
      Object.assign(this._options.values, _changes.options);
    }

    // Data can be undefined, so we simply check if the key exists.
    if ('data' in _changes) {
      this._data = _changes.data as any;
    }

    await this.context.hooks.call('postStateChange', {
      state: this as any,
      changed: _changes,
    });
  }
}

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

// export interface EndOptions {
//   warning?: string;
//   error?: string;
// }
