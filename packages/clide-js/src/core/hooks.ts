import { MaybePromise } from 'src/utils/types';
import { Context } from './context';
import { OptionsConfig } from './options/types';
import { OptionValues, ParseCommandFn } from './parse';
import { ResolveCommandFn, ResolvedCommand } from './resolve';
import { NextState, State } from './state';

/**
 * The hooks that can be registered and called to modify the behavior of the
 * CLI, keyed by event name.
 * @group Hooks
 */
export interface Hooks {
  // called once during preparation
  beforeResolve: (payload: {
    /** The command string that was passed to the CLI. */
    commandString: string;
    /** The path to the directory where the commands live. */
    commandsDir: string;
    /**
     * Override the context's configured resolve function.
     * @param resolveFn - The new resolve function.
     */
    setResolveFn: (resolveFn: ResolveCommandFn) => void;
    /**
     * Override the context's configured parse function.
     * @param parseFn - The new parse function.
     */
    setParseFn: (parseFn: ParseCommandFn) => void;
    /**
     * Add additional resolved commands to the context.
     * @param resolvedCommands - The resolved commands to add.
     */
    addResolvedCommands: (result: ResolvedCommand[]) => void;
    /** Skip resolving the command. */
    skip: () => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once for each subcommand during preparation
  beforeResolveNext: (payload: {
    /** The remaining command string that needs to be resolved. */
    commandString: string;
    /**
     * The path to the directory where commands for the remaining command string
     * live. Usually a subdirectory of the commands directory.
     */
    commandsDir: string;
    /** The previously resolved command. */
    lastResolved: ResolvedCommand;
    /**
     * Override the context's configured resolve function.
     * @param resolveFn - The new resolve function.
     */
    setResolveFn: (resolveFn: ResolveCommandFn) => void;
    /**
     * Override the context's configured parse function.
     * @param parseFn - The new parse function.
     */
    setParseFn: (parseFn: ParseCommandFn) => void;
    /**
     * Add additional resolved commands to the context.
     * @param resolvedCommands - The resolved commands to add.
     */
    addResolvedCommands: (resolvedCommands: ResolvedCommand[]) => void;
    /** Skip resolving the command. */
    skip: () => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once during preparation
  afterResolve: (payload: {
    /** The resolved commands. */
    resolvedCommands: ResolvedCommand[];
    /**
     * Add additional resolved commands to the context.
     * @param resolvedCommands - The resolved commands to add.
     *
     * @remarks
     * After each command is resolved, it's options config is merged with the
     * context's existing options config so that context is always up to date in
     * the {@linkcode beforeResolveNext} hook. Because of this, resolved commands
     * can't be replaced once resolved, only added to. If you need to manually
     * set the resolved commands, you can use the {@linkcode beforeResolve} hook to
     * do so.
     */
    addResolvedCommands: (result: ResolvedCommand[]) => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once during preparation
  beforeParse: (payload: {
    /** The command string that was passed to the CLI. */
    commandString: string | string[];
    /**
     * The context's final options config from all plugins and resolved
     * commands.
     */
    optionsConfig: OptionsConfig;
    /**
     * Override the context's configured parse function.
     * @param parseFn - The new parse function.
     */
    setParseFn: (parseFn: ParseCommandFn) => void;
    /**
     * Manually set the parsed options and skip parsing.
     * @param optionValues - The parsed option values.
     */
    setParsedOptionsAndSkip: (optionValues: OptionValues) => void;
    /** Skip parsing the command. */
    skip: () => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once during preparation
  afterParse: (payload: {
    /** The resulting parsed options. */
    parsedOptions: OptionValues;
    /**
     * Override the parsed options.
     * @param optionValues - The parsed option values.
     */
    setParsedOptions: (optionValues: OptionValues) => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once for every execution
  beforeExecute: (payload: {
    /** The initial data that was passed to the state. */
    initialData: unknown;
    /** The state object. */
    state: State;
    /** Set the final result and skip execution. */
    setResultAndSkip: (result: unknown) => void;
    /**
     * Override the state's initial data.
     * @param data - The new initial data.
     */
    setInitialData: (data: unknown) => void;
    /** Skip execution. */
    skip: () => void;
  }) => MaybePromise<void>;

  // called once for every execution
  afterExecute: (payload: {
    /** The state object. */
    state: State;
    /** The final result. */
    result: unknown;
    /** Override the final result. */
    setResult: (result: unknown) => void;
  }) => MaybePromise<void>;

  // called every time the state changes during execution
  beforeStateChange: (payload: {
    /** The state object. */
    state: State;
    /** The changes that will be applied to the state. */
    changes: Partial<NextState>;
    /**
     * Override the changes that will be applied to the state.
     * @param changes - The new changes.
     */
    setChanges: (state: Partial<NextState>) => void;
    /** Skip the state change. */
    skip: () => void;
  }) => MaybePromise<void>;

  // called every time the state changes during execution
  afterStateChange: (payload: {
    /** The state object. */
    state: State;
    /** The changes that were applied to the state. */
    changed: Partial<NextState>;
  }) => MaybePromise<void>;

  // called for every call of state.next()
  beforeNext: (payload: {
    /** The state object. */
    state: State;
    /** The data that will be passed to the next command. */
    data: unknown;
    /**
     * Override the data that will be passed to the next command.
     * @param data - The new data.
     */
    setData: (data: unknown) => void;
    /** The next command that will be executed. */
    nextCommand: ResolvedCommand | undefined;
    /**
     * Override the next command that will be executed.
     * @param command - The new next command.
     */
    setNextCommand: (command: ResolvedCommand) => void;
  }) => MaybePromise<void>;

  // called once per execution, but only if state.end() is called
  beforeEnd: (payload: {
    /** The state object. */
    state: State;
    /** The data that will be returned. */
    data: unknown;
    /**
     * Override the data that will be returned.
     * @param data - The new data.
     */
    setData: (data: unknown) => void;
  }) => MaybePromise<void>;

  // called whenever an error is thrown
  error: (payload: {
    /** The command's context object. */
    context: Context;
    /** The error that was thrown. */
    error: unknown;
    /**
     * Override the error that will be thrown.
     * @param error - The new error.
     */
    setError: (error: unknown) => void;
    /** Prevent the error from being thrown. */
    ignore: () => void;
  }) => MaybePromise<void>;

  // called whenever a plugin or command intend to exit the process
  exit: (payload: {
    /** The command's context object. */
    context: Context;
    /** The exit code. */
    code: number;
    /** An optional message to log. */
    message?: any;
    /**
     * Override the exit code.
     * @param code - The new exit code.
     */
    setCode: (code: number) => void;
    /**
     * Override the message to log.
     * @param message - The new message.
     */
    setMessage: (message: any) => void;
    /** Prevent the process from exiting. */
    cancel: () => void;
  }) => MaybePromise<void>;
}

/**
 * A class for registering, un-registering, and calling hooks. The events that
 * can be hooked into are defined in the {@linkcode Hooks} type, but any string
 * can be used as an event name, allowing plugins to define their own hooks.
 *
 * @remarks
 * Each registered hook is awaited in series to ensure that hooks are
 * called in the order they were registered.
 * @group Hooks
 */
// similar to EventEmitter, but blocking
export class HooksEmitter<THooks extends HooksObject = Hooks> {
  private hooks: {
    [event: string]: ((...args: any) => void)[];
  } = {};

  /**
   * Register a new hook for a given lifecycle event.
   * @param event - The event to register the hook for.
   * @param hook - The function to call when the event is triggered.
   */
  on<TEvent extends keyof THooks>(event: TEvent, hook: THooks[TEvent]): void;
  on<TEvent extends keyof THooks | string>(
    event: string,
    hook: TEvent extends keyof THooks
      ? THooks[TEvent]
      : (...args: any[]) => void,
  ): void;
  on(event: string, hook: (...args: any) => any): void {
    const existing = this.hooks[event];
    if (existing) {
      existing.push(hook);
    } else {
      this.hooks[event] = [hook];
    }
  }

  /**
   * Un-register a hook for a given lifecycle event.
   * @param event - The event to un-register the hook for.
   * @param hook - The function to un-register.
   * @returns Whether a hook was un-registered.
   */
  off<TEventName extends keyof THooks>(
    event: TEventName,
    hook: THooks[TEventName],
  ): boolean;
  off<TEventName extends keyof THooks | string>(
    event: string,
    hook: TEventName extends keyof THooks
      ? THooks[TEventName]
      : (...args: any) => any,
  ): boolean;
  off(event: string, hook: (...args: any) => any) {
    let didRemove = false;
    const existing = this.hooks[event];
    if (existing) {
      this.hooks[event] = existing.filter((handler) => {
        if (handler === hook) {
          didRemove = true;
          return false;
        }
        return true;
      });
    }
    return didRemove;
  }

  /**
   * Register a new hook for a given lifecycle event that will only be called
   * once, then un-registered.
   * @param event - The event to register the hook for.
   * @param hook - The function to call when the event is triggered.
   */
  once<TEventName extends keyof THooks>(
    event: TEventName,
    hook: THooks[TEventName],
  ): void;
  once<TEventName extends keyof THooks | string>(
    event: string,
    hook: TEventName extends keyof THooks
      ? THooks[TEventName]
      : (...args: any) => any,
  ): void;
  once(event: string, hook: (...args: any) => any) {
    const wrapped = (...args: any) => {
      this.off(event, wrapped as any);
      hook(...args);
    };
    this.on(event, wrapped as any);
  }

  /**
   * Call all hooks for a given event.
   * @param event - The event to call the hooks for.
   * @param args - The arguments to pass to the hooks.
   */
  call<TEventName extends keyof THooks>(
    event: TEventName,
    ...args: THooks[TEventName] extends (...args: any) => any
      ? Parameters<THooks[TEventName]>
      : any[]
  ): Promise<void>;
  call<TEventName extends keyof THooks | string = keyof THooks>(
    event: TEventName,
    ...args: typeof event extends keyof THooks
      ? THooks[TEventName] extends (...args: any) => any
        ? Parameters<THooks[TEventName]>
        : any[]
      : any[]
  ): Promise<void>;
  async call(event: string, ...args: any) {
    for (const hook of this.hooks[event] || []) {
      await (hook as any)(...args);
    }
  }
}

/**
 * A generic type for the payload of a hook.
 * @group Hooks
 */
export type HookPayload<
  TEventName extends keyof THooks,
  THooks extends HooksObject = Hooks,
> = THooks[TEventName] extends (...args: any) => any
  ? Parameters<THooks[TEventName]>[0]
  : unknown;

export type HooksObject =
  | {
      [event: string]: (payload: any) => void;
    }
  | Hooks;
