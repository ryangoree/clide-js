import path from 'node:path';
import { hideBin } from 'src/utils/argv';
import { getCallerPath } from 'src/utils/caller-path';
import { isDirectory } from 'src/utils/fs';
import { Context } from './context';
import { ClideError, ClientError } from './errors';
import { HookPayload, HooksEmitter } from './hooks';
import { OptionsConfig } from './options/types';
import { Plugin } from './plugin';

/**
 * Options for the {@linkcode run} function.
 * @group Run
 */
export interface RunOptions {
  /**
   * The command string or array to be parsed and executed. If not provided, it
   * defaults to system arguments.
   */
  command?: string | string[];
  /**
   * A directory path containing command modules.
   * @default "<cwd>/commands" || "<caller-dir>/commands"
   */
  commandsDir?: string;
  /**
   * Initial context or data to pass to commands during execution.
   */
  initialData?: any;
  /**
   * Options to include in the context.
   */
  options?: OptionsConfig;
  /**
   * An array of plugins that can modify or augment the behavior of commands.
   */
  plugins?: Plugin[];
  /**
   * A hook that runs before attempting to locate and import command modules.
   */
  beforeResolve?: (payload: HookPayload<'preResolve'>) => void;
  /**
   * A hook that runs after importing command modules.
   */
  afterResolve?: (payload: HookPayload<'postResolve'>) => void;
  /**
   * A hook that runs before parsing the command string using the options config
   * from plugins and imported command modules.
   */
  beforeParse?: (payload: HookPayload<'preParse'>) => void;
  /**
   * A hook that runs after parsing the command string.
   */
  afterParse?: (payload: HookPayload<'postParse'>) => void;
  /**
   * A hook that runs before calling the first command.
   */
  beforeExecute?: (payload: HookPayload<'preExecute'>) => void;
  /**
   * A hook that runs once all commands have been called or when `context.end()`
   * is called.
   */
  afterExecute?: (payload: HookPayload<'postExecute'>) => void;
  /**
   * A hook that runs before executing the `context.next()` function.
   */
  beforeNext?: (payload: HookPayload<'preNext'>) => void;
  /**
   * A hook that runs before executing the `context.end()` function.
   */
  beforeEnd?: (payload: HookPayload<'preEnd'>) => void;
  /**
   * A hook that runs whenever an error is thrown.
   */
  onError?: (payload: HookPayload<'error'>) => void;
  /**
   * A hook that runs whenever a plugin or command intends to exit the process.
   */
  onExit?: (payload: HookPayload<'exit'>) => void;
}

/**
 * Run a command with optional plugins and dynamic command discovery.
 * @returns The result of the executed command.
 *
 * @example
 * run({
 *   command: 'build ./src --watch --env=prod',
 *   plugins: [help()]
 * });
 *
 * @remarks
 * If no commands directory is provided, this function will try to find one by
 * first looking for a "commands" directory in the current working directory,
 * then looking for a "commands" directory adjacent to the file that called this
 * function.
 *
 * For example, if the node process is started from the root of a project and
 * this function is called from a file at "src/cli.js", it will look for a
 * "commands" directory in the root of the project and in the "src" directory.
 * @group Run
 */
export async function run({
  command = hideBin(process.argv),
  commandsDir,
  initialData,
  options,
  plugins,
  beforeResolve,
  afterResolve,
  beforeParse,
  afterParse,
  beforeExecute,
  afterExecute,
  beforeNext,
  beforeEnd,
  onError,
  onExit,
}: RunOptions = {}) {
  // attempt to find commands directory
  if (!commandsDir) {
    // default to "<cwd>/commands"
    const defaultCommandsDirName = 'commands';
    let defaultCommandsDir = path.resolve(defaultCommandsDirName);

    // if "<cwd>/commands" doesn't exist, try "<caller-dir>/commands"
    if (!isDirectory(defaultCommandsDir)) {
      const callerDirPath = path.dirname(getCallerPath() || '');
      defaultCommandsDir = path.join(callerDirPath, defaultCommandsDirName);
    }

    // if neither "<cwd>/commands" nor "<caller-dir>/commands" exist, throw
    if (!isDirectory(defaultCommandsDir)) {
      throw new ClideError('Unable to find commands directory');
    }

    commandsDir = defaultCommandsDir;
  }

  // coerce command to string
  const commandString =
    typeof command === 'string' ? command : command.join(' ');

  // create hooks emitter
  const hooks = new HooksEmitter();

  // register hooks
  if (beforeResolve) hooks.on('preResolve', beforeResolve);
  if (afterResolve) hooks.on('postResolve', afterResolve);
  if (beforeParse) hooks.on('preParse', beforeParse);
  if (afterParse) hooks.on('postParse', afterParse);
  if (beforeExecute) hooks.on('preExecute', beforeExecute);
  if (afterExecute) hooks.on('postExecute', afterExecute);
  if (beforeNext) hooks.on('preNext', beforeNext);
  if (beforeEnd) hooks.on('preEnd', beforeEnd);
  if (onError) hooks.on('error', onError);
  if (onExit) hooks.on('exit', onExit);

  // create context
  const context = new Context({
    commandString,
    commandsDir,
    plugins,
    hooks,
  });

  // Add options to the context.
  if (options) {
    context.addOptions(options);
  }

  // Attempt to prepare and execute the command and return the result.
  try {
    await context.prepare();
    await context.execute(initialData);
    return context.result;
  } catch (error) {
    // simply return client errors since they're handled by the client
    if (error instanceof ClientError) {
      return error;
    }

    // coerce non-cli errors to cli errors
    if (error instanceof ClideError) {
      throw error;
    } else {
      throw new ClideError(error);
    }
  }
}
