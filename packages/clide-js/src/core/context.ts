import { Client } from 'src/core/client';
import { ClideError } from 'src/core/errors';
import { HooksEmitter } from 'src/core/hooks';
import type { OptionValues, OptionsConfig } from 'src/core/options/options';
import { type ParseCommandFn, parseCommand } from 'src/core/parse';
import type { Plugin, PluginInfo } from 'src/core/plugin';
import {
  type ResolveCommandFn,
  type ResolvedCommand,
  SubcommandRequiredError,
  resolveCommand,
} from 'src/core/resolve';
import { State } from 'src/core/state';

/**
 * Params for creating a new {@linkcode Context} instance.
 * @group Context
 */
export interface ContextParams<TOptions extends OptionsConfig = OptionsConfig> {
  /** The command string to be executed */
  commandString: string;
  /** The path to the directory containing command modules */
  commandsDir: string;
  /** The standard streams client */
  client?: Client;
  /** The hooks emitter */
  hooks?: HooksEmitter;
  /** A list of plugins to load */
  plugins?: Plugin[];
  /** The options config for the command */
  options?: TOptions;
  /** An optional function to replace the default command resolver */
  resolveFn?: ResolveCommandFn;
  /** An optional function to replace the default command parser */
  parseFn?: ParseCommandFn;
}

/**
 * The command lifecycle manager.
 *
 * The `Context` serves as the orchestrator for the entire command lifecycle. It
 * is responsible for initializing the CLI environment, resolving commands,
 * parsing options, and managing execution flow. It ensures that all aspects of
 * the CLI are prepared and ready before any action is taken, establishing a
 * predictable and stable execution environment.
 *
 * Philosophy:
 * - Immutable Configuration: Once the context is prepared, its configuration
 *   should not change. This immutability guarantees consistency throughout the
 *   CLI's operation and avoids side effects that could arise from dynamic
 *   changes in the environment.
 * - Explicit Lifecycle Management: By clearly defining lifecycle hooks and
 *   preparation stages, `Context` offers explicit control over the command
 *   execution process, allowing for extensibility and customization without
 *   sacrificing predictability.
 * - Separation of Concerns: `Context` focuses on the setup and execution
 *   environment, while {@linkcode State} manages the actual progression and
 *   state changes during command execution. This separation ensures that each
 *   module only handles its designated responsibilities, making the system
 *   easier to maintain and extend.
 * - Fail-fast Philosophy: The context should catch and handle errors as early
 *   as possible (during the preparation phase), ensuring that execution only
 *   proceeds when all systems are nominal. The exception to this rule is option
 *   validation, which is performed dynamically when options are accessed during
 *   execution. This is done to give command handlers the ability to gracefully
 *   handle missing or invalid options and potentially prompt the user for the
 *   missing information.
 *
 * Scope:
 * - Plugin Initialization: Loading and preparing all plugins for the execution
 *   cycle.
 * - Command Resolution: Determining the sequence of command modules to be
 *   executed based on the input string.
 * - Option Parsing: Interpreting command-line arguments and flags into a
 *   structured format for consumption by commands.
 * - Execution Readiness: Ensuring that the context has been fully prepared
 *   before allowing the execution to proceed.
 * - Error Management: Providing a centralized mechanism for error handling
 *   during the preparation and execution phases.
 * - Exit Management: Providing a centralized mechanism for exiting the CLI.
 *
 * @group Context
 */
export class Context<TOptions extends OptionsConfig = OptionsConfig> {
  /** The command string to be executed. */
  readonly commandString: string;
  /** The path to the directory containing command modules. */
  readonly commandsDir: string;
  /** The standard streams client. */
  readonly client: Client;
  /** The hooks emitter. */
  readonly hooks: HooksEmitter;
  /**
   * Metadata about the plugins that will be used during preparation and
   * execution.
   */
  readonly plugins: {
    [name: string]: PluginInfo & {
      isReady: boolean;
    };
  };

  #plugins: Plugin[];
  #options: TOptions;

  #isParsed = false;
  #parseFn: ParseCommandFn;
  #parsedOptions: OptionValues = {};

  #isResolved = false;
  #resolveFn: ResolveCommandFn;
  #resolvedCommands: ResolvedCommand[] = [];

  #isReady = false;
  #result: unknown;

  constructor({
    commandString,
    commandsDir,
    hooks = new HooksEmitter(),
    client = new Client(),
    plugins = [],
    options = {} as TOptions,
    resolveFn = resolveCommand,
    parseFn = parseCommand,
  }: ContextParams<TOptions>) {
    this.commandString = commandString;
    this.commandsDir = commandsDir;
    this.client = client;
    this.hooks = hooks;
    this.plugins = Object.freeze(
      Object.fromEntries(
        plugins.map(({ name, version, description, meta }) => [
          name,
          { name, version, description, meta, isReady: false },
        ]),
      ),
    );
    this.#plugins = plugins;
    this.#options = options as TOptions;
    this.#parseFn = parseFn;
    this.#resolveFn = resolveFn;
  }

  // Static Methods //

  /**
   * Create a new `Context` instance and automatically prep it for execution.
   */
  static async prepare(options: ContextParams) {
    const context = new Context(options);
    await context.prepare();
    return context;
  }

  // Getters //

  /** The options config for the command. */
  get options() {
    return this.#options;
  }
  /** A list of the resolved commands. */
  get resolvedCommands() {
    return this.#resolvedCommands;
  }
  /** The parsed option values for the command. */
  get parsedOptions() {
    return this.#parsedOptions;
  }
  /** The result of the most recent execution. */
  get result() {
    return this.#result;
  }

  // Methods //

  /**
   * Prepare the context for execution.
   *
   * 1. Initialize plugins
   * 2. Resolve the command string into a list of imported command modules
   * 3. Parse the command string with the final options config from plugins and
   *    commands
   * 5. Mark the context as ready
   *
   * @remarks This method is idempotent.
   */
  async prepare() {
    if (this.#isReady) return;

    try {
      // 1. Initialize plugins
      for (const { name, init } of this.#plugins) {
        const info = this.plugins[name];
        if (!info) continue;
        info.isReady = await init(this);
        Object.freeze(info);
      }

      // 2. Resolve the command string into a list of imported command modules
      await this.#resolveWithHooks();

      // 3. Parse the command string with the final options config from plugins
      //    and resolved commands
      await this.#parseWithHooks();
    } catch (error) {
      await this.throw(error);
    }

    // Mark the context as ready
    this.#isReady = true;
  }

  // Note: The following methods are defined as arrow functions to ensure that
  // they are bound to the context instance. This is necessary to allow them to
  // be passed as callbacks to hooks and other functions while maintaining the
  // correct `this` context.

  /**
   * Append additional options to the context's options config. Typically, this
   * is done by plugins during initialization.
   * @param options - The options config to be merged with the context's options
   * config.
   */
  readonly addOptions = (options: OptionsConfig) => {
    Object.assign(this.#options, options);
  };

  /**
   * Resolve a command string into a list of imported command modules using the
   * configured `resolveFn` and `parseFn`.
   *
   * This function has no side effects and is simply a wrapper around the
   * configured `resolveFn` and `parseFn`.
   *
   * @param commandString - The command string to be resolved. Defaults to the
   * context's command string.
   * @param commandsDir - The path to the directory containing command modules.
   * Defaults to the context's commands directory.
   *
   * @returns A `ResolvedCommand` object.
   */
  readonly resolveCommand = async (
    commandString: string = this.commandString,
    commandsDir: string = this.commandsDir,
  ) => {
    const resolved = await this.#resolveFn({
      commandString,
      commandsDir,
      parseFn: this.parseCommand,
    });

    // Override the resolveNext function to use the context's resolveCommand
    if (resolved.resolveNext) {
      resolved.resolveNext = () =>
        this.resolveCommand(
          resolved.remainingCommandString,
          resolved.subcommandsDir,
        );
    }

    return resolved;
  };

  /**
   * Parse a command string into a structured object using the configured
   * `parseFn` and the context's options config.
   *
   * This function has no side effects and is simply a wrapper around the
   * configured `parseFn`.
   *
   * @param commandString - The command string to be parsed. Defaults to the
   * context's command string.
   * @param optionsConfig - Additional options config to be merged with the
   * context's options config.
   *
   * @returns A `ParsedCommand` object containing the parsed command tokens and
   * option values.
   */
  readonly parseCommand = (
    commandString: string = this.commandString,
    optionsConfig?: OptionsConfig,
  ) => {
    return this.#parseFn(commandString, {
      ...this.options,
      ...optionsConfig,
    });
  };

  // Hooked Methods //

  /**
   * Execute the context's command string.
   *
   * This function will override the context's result with the result of the
   * final command in the chain each time it is called.
   *
   * @param initialData - Optional data to be passed to the first command in the
   * chain.
   */
  readonly execute = async (initialData?: any) => {
    // Create a new state for each execution
    const state = new State({
      context: this,
      initialData,
    });

    let skip = false;
    let result = initialData;

    await this.hooks.call('beforeExecute', {
      state,
      initialData,
      setInitialData: (newData) => {
        initialData = newData;
        result = newData;
      },
      setResultAndSkip: (newResult) => {
        result = newResult;
        skip = true;
      },
      skip: () => {
        skip = true;
      },
    });

    // Ensure the context is ready before proceeding
    if (!skip && !this.#isReady) {
      // this.throw must be awaited since it could be ignored by an async hook
      await this.throw(
        new ClideError(
          "Context isn't ready. Did you forget to call prepare()?",
        ),
      );
    }

    // If the command wasn't skipped, begin execution
    if (!skip) {
      try {
        await state.start(initialData);
        result = state.data;
      } catch (error) {
        await this.throw(error);
      }
    }

    await this.hooks.call('afterExecute', {
      result,
      state,
      setResult: (newResult) => {
        result = newResult;
      },
    });

    this.#result = result;
  };

  /**
   * Throw an error, allowing hooks to modify the error or ignore it.
   * @param error - The error to be thrown.
   */
  readonly throw = async (error: unknown) => {
    let ignore = false;

    await this.hooks.call('error', {
      error,
      context: this,
      setError: (newError) => {
        error = newError;
      },
      ignore: () => {
        ignore = true;
      },
    });

    if (!ignore) throw error;
  };

  /**
   * Exit the CLI with an optional exit code and message.
   * @param code - The exit code. Defaults to 0.
   * @param message - The message to be displayed before exiting.
   */
  readonly exit = async (code = 0, message?: any) => {
    let cancel = false;

    await this.hooks.call('exit', {
      code,
      message,
      context: this,
      setCode: (newCode) => {
        code = newCode;
      },
      setMessage: (newMessage) => {
        message = newMessage;
      },
      cancel: () => {
        cancel = true;
      },
    });

    if (!cancel) {
      if (message) {
        if (code === 0) this.client.log(message);
        else this.client.error(message);
      }
      process.exit(code);
    }
  };

  /**
   * Resolve the command string into a list of imported command modules, setting
   * the context's `resolvedCommands` property.
   *
   * @remarks This method is idempotent.
   */
  async #resolveWithHooks() {
    if (this.#isResolved) return;

    await this.hooks.call('beforeResolve', {
      commandString: this.commandString,
      commandsDir: this.commandsDir,
      context: this,
      setResolveFn: (resolveFn) => {
        this.#resolveFn = resolveFn;
      },
      setParseFn: (parseFn) => {
        this.#parseFn = parseFn;
      },
      addResolvedCommands: (resolvedCommands) => {
        for (const resolved of resolvedCommands) {
          if (resolved.command.options) {
            this.addOptions(resolved.command.options);
          }
          this.#resolvedCommands.push(resolved);
        }
      },
      skip: () => {
        this.#isResolved = true;
      },
    });

    // Only resolve if the hook didn't skip
    let pendingCommand = this.#isResolved
      ? undefined
      : await this.resolveCommand();

    // Continue resolving until the last command is reached or the
    // `beforeResolveNext` hook skips
    while (pendingCommand && !this.#isResolved) {
      // Add the command's options to the context's options config
      if (pendingCommand.command.options) {
        this.addOptions(pendingCommand.command.options);
      }

      // Add the resolved command to the list of resolved commands
      this.#resolvedCommands.push(pendingCommand);

      // TODO: Add init property to command module?
      // if (resolved.command.init) {
      //   await resolved.command.init(this);
      // }

      // If the command doesn't have a resolveNext function and doesn't require
      // a subcommand, then we're done resolving.
      if (
        !pendingCommand.resolveNext &&
        !pendingCommand.command.requiresSubcommand
      ) {
        this.#isResolved = true;
        break;
      }

      await this.hooks.call('beforeResolveNext', {
        commandString: pendingCommand.remainingCommandString,
        commandsDir: pendingCommand.subcommandsDir,
        lastResolved: pendingCommand,
        setResolveFn: (resolveFn) => {
          this.#resolveFn = resolveFn;
        },
        setParseFn: (parseFn) => {
          this.#parseFn = parseFn;
        },
        skip: () => {
          this.#isResolved = true;
        },
        addResolvedCommands: (resolvedCommands) => {
          for (const resolved of resolvedCommands) {
            if (resolved.command.options) {
              this.addOptions(resolved.command.options);
            }
            this.#resolvedCommands.push(resolved);
          }
        },
        context: this,
      });

      // Don't resolve if the hook skipped
      pendingCommand = this.#isResolved
        ? undefined
        : await pendingCommand.resolveNext?.();
    }

    await this.hooks.call('afterResolve', {
      context: this,
      resolvedCommands: this.#resolvedCommands,
      addResolvedCommands: (resolvedCommands) => {
        for (const resolved of resolvedCommands) {
          if (resolved.command.options) {
            this.addOptions(resolved.command.options);
          }
          this.#resolvedCommands.push(resolved);
        }
      },
    });

    // Throw an error if the last command requires a subcommand but none was
    // provided.
    if (pendingCommand?.command.requiresSubcommand) {
      await this.throw(new SubcommandRequiredError(this.commandString));
    }

    // Mark the context as resolved
    this.#isResolved = true;
  }

  /**
   * Parse the command string with the final options config from plugins and
   * resolved commands, setting the context's `parsedOptions` property.
   *
   * @remarks This method is idempotent.
   */
  async #parseWithHooks() {
    if (this.#isParsed) return;

    await this.hooks.call('beforeParse', {
      commandString: this.commandString,
      optionsConfig: this.options,
      setParseFn: (parseFn) => {
        this.#parseFn = parseFn;
      },
      setParsedOptionsAndSkip: (optionValues) => {
        this.#parsedOptions = optionValues;
        this.#isParsed = true;
      },
      skip: () => {
        this.#isParsed = true;
      },
      context: this,
    });

    // Don't parse if the hook skipped
    if (!this.#isParsed) {
      const { options } = await this.parseCommand();
      this.#parsedOptions = options;
      this.#isParsed = true;
    }

    await this.hooks.call('afterParse', {
      parsedOptions: this.#parsedOptions,
      setParsedOptions: (optionValues) => {
        this.#parsedOptions = optionValues;
      },
      context: this,
    });
  }
}
