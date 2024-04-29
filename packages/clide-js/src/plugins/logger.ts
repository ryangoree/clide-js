import fs from 'fs';
import path from 'path';
import { Client } from 'src/core/client';
import type { Context } from 'src/core/context';
import { HookPayload } from 'src/core/hooks';
import { Plugin } from 'src/core/plugin';

interface LoggerOptions {
  /**
   * The prefix to use for log messages. Can be a string or a function that
   * returns a string. If a function is provided, it will be called each time a
   * log message is created.
   *
   * @defaultValue A timestamp.
   *
   * @example
   * ```ts
   * prefix: () => `${sessionId}-${new Date().toISOString()}`,
   * ```
   */
  prefix?: string | (() => string);

  /**
   * A path to a file to log to. If provided, the logger will log to this file
   * instead of the console, appending each log message followed by a newline.
   */
  logFile?: string;

  /**
   * Whether the logger is enabled.
   * @defaultValue `true`
   */
  enabled?: boolean;
}

/**
 * A minimal logger plugin that logs the result of each execution step. By
 * default, it uses the {@linkcode Client} from {@linkcode Context}. If a
 * `logFile` is provided, it will log to that file instead.
 *
 * The logger can be enabled or disabled at any time by emitting one of the
 * {@linkcode LoggerHooks} events:
 * - `enableLogger`: Turns the logger on.
 * - `disableLogger`: Turns the logger off.
 * - `toggleLogger`: Toggles the logger on or off.
 *
 * @example
 * ### Basic Usage
 *
 * ```ts
 * import { run, logger } from 'clide-js';
 *
 * run({ plugins: [logger()] });
 *
 *
 * ```
 *
 * ### Advanced Usage
 *
 * ```ts
 * import { run, logger } from 'clide-js';
 *
 * function timestamp() {
 *   return new Date().toISOString();
 * }
 *
 * run({
 *   plugins: [
 *     logger({
 *       prefix: timestamp,
 *       logFile: `logs/${timestamp()}.log`,
 *       enabled: process.env.NODE_ENV === 'development',
 *     })
 *   ],
 * });
 *
 *
 * ```
 *
 * ### Enable/Disable/Toggle the logger in a command
 *
 * ```ts
 * import { command } from 'clide-js';
 *
 * export default command({
 *   options: {
 *     v {
 *       description: 'Enable verbose logging',
 *       type: 'boolean',
 *       default: false,
 *     },
 *   },
 *   handler: async ({ options, context }) => {
 *     const verbose = await options.verbose();
 *
 *     if (verbose) {
 *       await context.hooks.call('enableLogger');
 *     } else {
 *       await context.hooks.call('disableLogger');
 *     }
 *
 *     // rest of the command...
 *   },
 * });
 * ```
 *
 * @group Plugins
 */
export function logger({
  prefix = defaultPrefix,
  logFile,
  enabled = true,
}: LoggerOptions = {}): Plugin<LoggerMeta> {
  // Coerce the prefix to a function.
  const prefixFn = typeof prefix === 'function' ? prefix : () => prefix;

  // if a logFile is provided, ensure the directory exists.
  if (logFile) {
    const dir = path.dirname(logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Create a function to centralize the logging logic.
  function log(client: Client, message: string, ...data: any[]) {
    message = `${prefixFn()}${message}`;
    if (logFile) {
      logToFile(logFile, message, ...data);
    } else {
      client.log(`${message}:`, ...data);
    }
  }

  // Create a function to log state transitions.
  function logTransition(
    transitionName: string,
    { state }: HookPayload<'beforeNext' | 'beforeEnd'>,
  ) {
    const { command, client, params, data } = state;
    if (!command) return;
    const { commandName, commandTokens, commandPath } = command;
    log(client, transitionName, {
      commandName,
      commandTokens,
      commandPath,
      params,
      data,
    });
  }

  // Create beforeNext and beforeEnd hooks that log the transitions.
  function beforeNext(payload: HookPayload<'beforeNext'>) {
    logTransition('next', payload);
  }
  function beforeEnd(payload: HookPayload<'beforeNext'>) {
    logTransition('end', payload);
  }

  // Create a meta object to provide read-only access to the enabled state.
  // It's important that the enabled state can't be modified directly because
  // the hooks need to be aware of the state changes.
  const meta: LoggerMeta = {
    get enabled() {
      return enabled;
    },
  };

  // Return the plugin object.
  return {
    name: 'logger',
    version: '0.0.1',
    description: 'Logs the result of each execution step.',
    meta,
    init: async ({ client, commandString, hooks }) => {
      // Create functions to enable and disable the hooks.
      function enableLogger() {
        hooks.on('beforeNext', beforeNext);
        hooks.on('beforeEnd', beforeEnd);
        enabled = true;
      }
      function disableLogger() {
        hooks.off('beforeNext', beforeNext);
        hooks.off('beforeEnd', beforeEnd);
        enabled = false;
      }

      // Log the command if the logger is enabled.
      if (enabled) {
        enableLogger();
        log(client, 'received command', commandString);
      }

      // Add custom hooks to enable, disable, and toggle the logger.
      hooks.on('enableLogger', () => enableLogger());
      hooks.on('disableLogger', () => disableLogger());
      hooks.on('toggleLogger', () =>
        enabled ? disableLogger() : enableLogger(),
      );

      return true;
    },
  };
}

export interface LoggerMeta {
  /**
   * Whether the logger is enabled.
   */
  readonly enabled: boolean;
}

export interface LoggerHooks {
  /**
   * Turns the logger on.
   */
  enableLogger: () => void;
  /**
   * Turns the logger off.
   */
  disableLogger: () => void;
  /**
   * Toggles the logger on or off.
   */
  toggleLogger: () => void;
}

function defaultPrefix() {
  return `[🪵 ${new Date().toISOString()}] `;
}

function logToFile(logFile: string, message: string, ...data: any[]) {
  const stringData = data
    .map((value) =>
      typeof value === 'object' ? JSON.stringify(value, null, 2) : value,
    )
    .join(' ');
  fs.appendFileSync(logFile, `${message}: ${stringData}\n`);
}
