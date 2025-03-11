export interface ClideErrorOptions extends ErrorOptions {
  /**
   * A custom prefix to use in place of {@linkcode ClideError.prefix}.
   */
  prefix?: string;

  /**
   * A custom name to use in place of {@linkcode ClideError.name}.
   */
  name?: string;
}

/**
 * An error thrown by the CLI engine.
 *
 * This error is designed to ensure clean stack trace formatting even when
 * minified and can be extended to create other error types with the same
 * behavior.
 *
 * @example
 * ```ts
 * class FooCliError extends ClideError {
 *   constructor(message: string, options?: ErrorOptions) {
 *     super(message, {
 *       prefix: "👺 ",
 *       name: "Foo CLI Error",
 *       ...options,
 *     });
 *   }
 * }
 *
 * throw new FooCliError("Something went wrong");
 * // 👺 Foo CLI Error: Something went wrong
 * //     at ...
 * ```
 *
 * @group Errors
 */
export class ClideError extends Error {
  static prefix = '✖ ';
  static name = 'CLI Error' as const;

  constructor(error: any, options?: ClideErrorOptions) {
    // Coerce the error to a string, or throw the original error if unable.
    let message: string;
    try {
      message = error?.message ?? String(error);
    } catch {
      throw error;
    }

    super(message);
    this.name = options?.name ?? ClideError.name;

    // Minification can mangle the stack traces of custom errors by obfuscating
    // the class name and including large chunks of minified code in the output.
    // To remedy this, the original stack trace is copied from either the given
    // error or a new error instance; and the stack getter is overridden to
    // ensure it's nicely formatted.

    const isError = error instanceof Error;
    const cause = options?.cause ?? error?.cause;

    let stackTarget: Error = error;
    if (!isError) {
      stackTarget = new Error();
      Error.captureStackTrace?.(stackTarget, new.target);
    }
    const targetStack = stackTarget.stack;

    let customName: string | undefined;
    if (error?.name && error.name !== 'Error') {
      customName = error.name;
    } else if (isError && error.constructor.name !== 'Error') {
      customName = error.constructor.name;
    }

    // Doing this in the constructor prevents the need to add custom properties
    // to the prototype, which would be displayed in the stack trace. The getter
    // ensures the name and message are up-to-date when accessed (e.g., after
    // subclassing and changing the name).
    Object.defineProperty(this, 'stack', {
      get(): string {
        let stack = `${options?.prefix ?? ClideError.prefix}${this.name}`;

        if (customName) {
          stack += ` [${customName}]`;
        }

        const messageLines = this.message?.split('\n');
        if (this.message) {
          stack += `: ${messageLines.join('\n  ')}`;
        }

        if (targetStack) {
          let stackLines = targetStack.split('\n').slice(1);
          if (this.message) {
            stackLines = stackLines.filter(
              (line) => !this.message.includes(line.trim()),
            );
          }
          const stackTrace = stackLines.join('\n');
          if (stackTrace) {
            stack += `\n${stackTrace}`;
          }
        }

        if (cause) {
          stack += `\nCaused by: ${cause.stack || cause}`.replaceAll(
            '\n',
            '\n  ',
          );
        }

        return stack.trim();
      },
    });
  }
}

/**
 * An error indicating the user has done something wrong.
 * @group Errors
 */
export class UsageError extends ClideError {
  constructor(error: unknown, options?: ClideErrorOptions) {
    super(error, {
      name: 'UsageError',
      ...options,
    });
  }
}
