import { MaybePromise } from 'src/utils/types';
import { Context } from './context';
import { OptionsConfig } from './options/types';
import { OptionValues, ParseCommandFn } from './parse';
import { ResolveCommandFn, ResolvedCommand } from './resolve';
import { NextState, State } from './state';

/**
 * The hooks that can be used to customize the CLI engine.
 * @group Hooks
 */
export interface Hooks {
  // called once during preparation
  preResolve: (payload: {
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
  preResolveNext: (payload: {
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
  postResolve: (payload: {
    /** The resolved commands. */
    resolvedCommands: ResolvedCommand[];
    /**
     * Add additional resolved commands to the context.
     * @param resolvedCommands - The resolved commands to add.
     *
     * @remarks
     * After each command is resolved, it's options config is merged with the
     * context's existing options config so that context is always up to date in
     * the {@linkcode preResolveNext} hook. Because of this, resolved commands
     * can't be replaced once resolved, only added to. If you need to manually
     * set the resolved commands, you can use the {@linkcode preResolve} hook to
     * do so.
     */
    addResolvedCommands: (result: ResolvedCommand[]) => void;
    /** The command's context object. */
    context: Context;
  }) => MaybePromise<void>;

  // called once during preparation
  preParse: (payload: {
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
  postParse: (payload: {
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
  preExecute: (payload: {
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
  postExecute: (payload: {
    /** The state object. */
    state: State;
    /** The final result. */
    result: unknown;
    /** Override the final result. */
    setResult: (result: unknown) => void;
  }) => MaybePromise<void>;

  // called every time the state changes during execution
  preStateChange: (payload: {
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
  postStateChange: (payload: {
    /** The state object. */
    state: State;
    /** The changes that were applied to the state. */
    changed: Partial<NextState>;
  }) => MaybePromise<void>;

  // called for every call of state.next()
  preNext: (payload: {
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
  preEnd: (payload: {
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
 * A generic type for the payload of a hook.
 * @group Hooks
 */
export type HookPayload<THook extends keyof Hooks> = Parameters<
  Hooks[THook]
>[0];

/**
 * A class for registering, un-registering, and calling hooks. The hooks called
 * by the CLI engine are defined in the {@linkcode Hooks} type, but any string
 * can be used as a hook name, allowing plugins to define their own hooks.
 *
 * @remarks
 * Each registered hook handler is awaited in series to ensure that hooks are
 * called in the order they were registered.
 * @group Hooks
 */
// similar to EventEmitter, but blocking
export class HooksEmitter {
  private hooks: Record<
    string,
    {
      handlers: ((...args: any) => any)[];
    }
  > = {};

  /**
   * Register a new hook handler for a given hook.
   * @param hook - The hook to register the handler for.
   * @param fn - The function to call when the hook is called.
   */
  on<THook extends keyof Hooks>(hook: THook, fn: Hooks[THook]): void;
  on<THook extends keyof Hooks | string>(
    hook: string,
    fn: THook extends keyof Hooks ? Hooks[THook] : (...args: any) => any,
  ): void;
  on(hook: string, fn: (...args: any) => any): void {
    const hooks = this.hooks[hook];
    if (hooks) {
      hooks.handlers.push(fn);
    } else {
      this.hooks[hook] = {
        handlers: [fn],
      };
    }
  }

  /**
   * Un-register a hook handler for a given hook.
   * @param hook - The hook to un-register the handler for.
   * @param fn - The function to un-register.
   * @returns Whether or not the handler was un-registered.
   */
  off<THook extends keyof Hooks>(hook: THook, fn: Hooks[THook]): boolean;
  off<THook extends keyof Hooks | string>(
    hook: string,
    fn: THook extends keyof Hooks ? Hooks[THook] : (...args: any) => any,
  ): boolean;
  off(hook: string, fn: (...args: any) => any) {
    let didRemove = false;
    if (this.hooks[hook]) {
      this.hooks[hook].handlers = this.hooks[hook].handlers.filter(
        (handler) => {
          if (handler === fn) {
            didRemove = true;
            return false;
          }
          return true;
        },
      );
    }
    return didRemove;
  }

  /**
   * Register a new hook handler for a given hook that will only be called once,
   * then un-registered.
   * @param hook - The hook to register the handler for.
   * @param fn - The function to call when the hook is called.
   */
  once<THook extends keyof Hooks>(hook: THook, fn: Hooks[THook]): void;
  once<THook extends keyof Hooks | string>(
    hook: string,
    fn: THook extends keyof Hooks ? Hooks[THook] : (...args: any) => any,
  ): void;
  once(hook: string, fn: (...args: any) => any) {
    const wrapped = (...args: any) => {
      this.off(hook, wrapped);
      fn(...args);
    };
    this.on(hook, wrapped);
  }

  /**
   * Call a hook with the given arguments.
   * @param hook - The hook to call.
   * @param args - The arguments to pass to the hook handlers.
   */
  call<THook extends keyof Hooks>(
    hook: THook,
    ...args: Parameters<Hooks[THook]>
  ): Promise<void>;
  call<THook extends keyof Hooks | string = keyof Hooks>(
    hook: THook,
    ...args: typeof hook extends keyof Hooks ? Parameters<Hooks[THook]> : any[]
  ): Promise<void>;
  async call(hook: string, ...args: any) {
    const { handlers } = this.hooks[hook] || {};
    for (const handler of handlers || []) {
      await (handler as any)(...args);
    }
  }
}

// wip idea: passing data via hooks

// hooks.on('connected', ({ wallet }) => setWallet(wallet));
// hooks.call('connect');

// myPlugin = ({ hooks }) => {
//   hooks.on('connect', () => {
//     // get wallet...

//     hooks.call('connected', { wallet: new Wallet(/* ... */) });
//   });
// };
