import { OptionValues, ParseCommandFn, parseCommand } from 'src/core/parse';
import { Client } from './client';
import { CommandModule } from './command';
import { ClideError, RequiredSubcommandError } from './errors';
import { HooksEmitter } from './hooks';
import { OptionsConfig } from './options/types';
import { Plugin, PluginInfo } from './plugin';
import { ResolveCommandFn, ResolvedCommand, resolveCommand } from './resolve';
import { State } from './state';

/**
 * Options for creating a new {@linkcode Context} instance.
 * @group Context
 */
export interface ContextOptions<
  TOptions extends OptionsConfig = OptionsConfig,
> {
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
  readonly plugins: Record<
    string,
    PluginInfo & {
      isReady: boolean;
    }
  >;

  private _plugins: Plugin[];
  private _options: TOptions;
  private _result: unknown;
  private _isReady = false;
  private _isResolved = false;
  private _resolvedCommands: ResolvedCommand[] = [];
  private _resolveFn: ResolveCommandFn;
  private _isParsed = false;
  private _parsedOptions: OptionValues = {};
  private _parseFn: ParseCommandFn;

  constructor({
    commandString,
    commandsDir,
    hooks = new HooksEmitter(),
    client = new Client(),
    plugins = [],
    options = {} as TOptions,
    resolveFn = resolveCommand,
    parseFn = parseCommand,
  }: ContextOptions<TOptions>) {
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
    this._plugins = plugins;
    this._options = options as TOptions;
    this._resolveFn = resolveFn;
    this._parseFn = parseFn;
  }

  /**
   * Create a new `Context` instance and automatically prep it for execution.
   */
  static prepare = async (options: ContextOptions) => {
    const context = new Context(options);
    await context.prepare();
    return context;
  };

  /** The options config for the command. */
  get options() {
    return this._options;
  }
  /** A list of the resolved commands. */
  get resolvedCommands() {
    return this._resolvedCommands;
  }
  /** The parsed option values for the command. */
  get parsedOptions() {
    return this._parsedOptions;
  }
  /** The result of the most recent execution. */
  get result() {
    return this._result;
  }

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
  readonly prepare = async () => {
    if (this._isReady) return;

    try {
      // 1. Initialize plugins
      for (const { name, init } of this._plugins) {
        const pluginInfo = this.plugins[name];
        pluginInfo.isReady = await init(this);
        Object.freeze(pluginInfo);
      }

      // 2. Resolve the command string into a list of imported command modules
      await this._resolve();

      // 3. Parse the command string with the final options config from plugins
      //    and resolved commands
      await this._parse();
    } catch (error) {
      await this.throw(error);
    }

    // Mark the context as ready
    this._isReady = true;
  };

  /**
   * Append additional options to the context's options config. Typically, this
   * is done by plugins during initialization.
   * @param options - The options config to be merged with the context's options
   * config.
   */
  readonly addOptions = (options: OptionsConfig) => {
    Object.assign(this._options, options);
  };

  /**
   * Resolve a command string into a list of imported command modules using
   * the configured `resolveFn` and `parseFn`.
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
    const resolved = await this._resolveFn({
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
    return this._parseFn(commandString, {
      ...this.options,
      ...optionsConfig,
    });
  };

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
      data: initialData,
    });

    let _initialData = initialData;
    let skip = false;
    let newResult = initialData;

    await this.hooks.call('beforeExecute', {
      state,
      initialData,
      setInitialData: (data) => {
        _initialData = data;
        newResult = data;
      },
      setResultAndSkip: (result) => {
        newResult = result;
        skip = true;
      },
      skip: () => {
        skip = true;
      },
    });

    // Ensure the context is ready before proceeding
    if (!skip && !this._isReady) {
      // Await this.throw which could be ignored by a hook
      await this.throw(
        new ClideError(
          "Context isn't ready. Did you forget to call prepare()?",
        ),
      );
    }

    // If the command wasn't skipped, begin execution
    if (!skip) {
      try {
        await state.start(_initialData);
        newResult = state.data;
      } catch (error) {
        await this.throw(error);
      }
    }

    await this.hooks.call('afterExecute', {
      result: newResult,
      state,
      setResult: (result) => {
        newResult = result;
      },
    });

    this._result = newResult;
  };

  /**
   * Invokes a command within the same execution context.
   *
   * @param commandModule The command module to invoke.
   * @param initialData Data to pass to the invoked command.
   */
  readonly invokeCommands = async (
    commands: (CommandModule<any, any> | ResolvedCommand)[],
    initialData?: any,
  ) => {
    const resolvedCommands: ResolvedCommand[] = [];
    const resolvedCommandsOptions: OptionsConfig = {};

    for (const command of commands) {
      let resolved: ResolvedCommand | undefined;

      if ('command' in command) {
        resolved = command;
      } else {
        resolved = {
          command,
          commandName: 'invokedCommand',
          remainingCommandString: '',
          commandPath: '',
          commandTokens: [],
          subcommandsDir: '',
          params: {},
        };
      }

      Object.assign(resolvedCommandsOptions, resolved.command.options);
      resolvedCommands.push(resolved);
    }

    // Create a new state for the invocation
    const state = new State({
      context: this,
      data: initialData,
      commands: resolvedCommands,
      options: {
        ...this.options,
        ...resolvedCommandsOptions,
      },
    });

    try {
      await state.start(initialData);
      return state.data;
    } catch (error) {
      await this.throw(error);
    }
  };

  /**
   * Throw an error, allowing hooks to modify the error or ignore it.
   * @param error - The error to be thrown.
   */
  readonly throw = async (error: unknown) => {
    let _error = error;
    let ignore = false;

    await this.hooks.call('error', {
      error: _error,
      context: this,
      setError: (error) => {
        _error = error;
      },
      ignore: () => {
        ignore = true;
      },
    });

    if (!ignore) throw _error;
  };

  /**
   * Exit the CLI with an optional exit code and message.
   * @param code - The exit code. Defaults to 0.
   * @param message - The message to be displayed before exiting.
   */
  readonly exit = async (code = 0, message?: any) => {
    let _code = code;
    let _message = message;
    let cancel = false;

    await this.hooks.call('exit', {
      code: _code,
      message: _message,
      context: this,
      setCode: (code) => {
        _code = code;
      },
      setMessage: (message) => {
        _message = message;
      },
      cancel: () => {
        cancel = true;
      },
    });

    if (!cancel) {
      if (_message) this.client.error(_message);
      process.exit(_code);
    }
  };

  /**
   * Resolve the command string into a list of imported command modules, setting
   * the context's `resolvedCommands` property.
   *
   * @remarks This method is idempotent.
   */
  private _resolve = async () => {
    if (this._isResolved) return;

    let resolved: ResolvedCommand | undefined;

    await this.hooks.call('beforeResolve', {
      commandString: this.commandString,
      commandsDir: this.commandsDir,
      context: this,
      setResolveFn: (resolveFn) => {
        this._resolveFn = resolveFn;
      },
      setParseFn: (parseFn) => {
        this._parseFn = parseFn;
      },
      addResolvedCommands: (resolvedCommands) => {
        for (const resolved of resolvedCommands) {
          if (resolved.command.options) {
            this.addOptions(resolved.command.options);
          }
          this._resolvedCommands.push(resolved);
        }
      },
      skip: () => {
        this._isResolved = true;
      },
    });

    // Don't resolve if the hook skipped
    if (!this._isResolved) {
      resolved = await this.resolveCommand();
    }

    // Continue resolving until the last command is reached or the
    // `beforeResolveNext` hook skips
    while (resolved && !this._isResolved) {
      // Add the command's options to the context's options config
      if (resolved.command.options) {
        this.addOptions(resolved.command.options);
      }

      // Add the resolved command to the list of resolved commands
      this._resolvedCommands.push(resolved);

      // TODO: Add init property to command module?
      // if (resolved.command.init) {
      //   await resolved.command.init(this);
      // }

      // If the command doesn't have a resolveNext function and doesn't require
      // a subcommand, then we're done resolving.
      if (!resolved.resolveNext && !resolved.command.requiresSubcommand) {
        this._isResolved = true;
        break;
      }

      await this.hooks.call('beforeResolveNext', {
        commandString: resolved.remainingCommandString,
        commandsDir: resolved.subcommandsDir,
        lastResolved: resolved,
        setResolveFn: (resolveFn) => {
          this._resolveFn = resolveFn;
        },
        setParseFn: (parseFn) => {
          this._parseFn = parseFn;
        },
        skip: () => {
          this._isResolved = true;
        },
        addResolvedCommands: (resolvedCommands) => {
          for (const resolved of resolvedCommands) {
            if (resolved.command.options) {
              this.addOptions(resolved.command.options);
            }
            this._resolvedCommands.push(resolved);
          }
        },
        context: this,
      });

      // Don't resolve if the hook skipped
      if (!this._isResolved) {
        // Set the next resolved command to the result of the resolveNext
        // function, or undefined if the command doesn't have a resolveNext
        resolved = await resolved.resolveNext?.();
      }
    }

    await this.hooks.call('afterResolve', {
      resolvedCommands: this._resolvedCommands,
      addResolvedCommands: (resolvedCommands) => {
        for (const resolved of resolvedCommands) {
          if (resolved.command.options) {
            this.addOptions(resolved.command.options);
          }
          this._resolvedCommands.push(resolved);
        }
      },
      context: this,
    });

    const lastResolved =
      this._resolvedCommands[this._resolvedCommands.length - 1];

    // Throw an error if the last command requires a subcommand but none was
    // provided.
    if (lastResolved?.command.requiresSubcommand) {
      await this.throw(new RequiredSubcommandError(this.commandString));
    }

    // Mark the context as resolved
    this._isResolved = true;
  };

  /**
   * Parse the command string with the final options config from plugins and
   * resolved commands, setting the context's `parsedOptions` property.
   *
   * @remarks This method is idempotent.
   */
  private _parse = async () => {
    if (this._isParsed) return;

    await this.hooks.call('beforeParse', {
      commandString: this.commandString,
      optionsConfig: this.options,
      setParseFn: (parseFn) => {
        this._parseFn = parseFn;
      },
      setParsedOptionsAndSkip: (optionValues) => {
        this._parsedOptions = optionValues;
        this._isParsed = true;
      },
      skip: () => {
        this._isParsed = true;
      },
      context: this,
    });

    // Don't parse if the hook skipped
    if (!this._isParsed) {
      const { options } = await parseCommand(this.commandString, this.options);
      this._parsedOptions = options;
      this._isParsed = true;
    }

    await this.hooks.call('afterParse', {
      parsedOptions: this._parsedOptions,
      setParsedOptions: (optionValues) => {
        this._parsedOptions = optionValues;
      },
      context: this,
    });
  };
}
