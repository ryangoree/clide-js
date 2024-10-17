interface ClideErrorOptions {
  cause?: unknown;
}

/**
 * An error thrown by the CLI engine.
 * @group Errors
 */
export class ClideError extends Error {
  static prefix = '✖ ';

  constructor(error: any, options?: ClideErrorOptions) {
    // Coerce the error to a string, or throw the original error if unable.
    let message: string;
    try {
      message = error?.message ?? String(error);
    } catch {
      throw error;
    }

    super(message);
    this.name = 'CLI Error';

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

    let customName: string | undefined;
    if (error?.name && error.name !== 'Error') {
      customName = error.name;
    } else if (isError && error.constructor.name !== 'Error') {
      customName = error.constructor.name;
    }

    // Doing this in constructor prevents the need to add custom properties to
    // the prototype, which would be displayed in the stack trace. The getter
    // ensures the message and name are up-to-date when accessed (e.g., after
    // subclassing and changing the name).
    Object.defineProperty(this, 'stack', {
      get(): string {
        let stack = `${ClideError.prefix}${this.name}`;

        if (customName) {
          stack += ` [${customName}]`;
        }

        if (this.message) {
          stack += `: ${this.message}`;
        }

        if (stackTarget.stack) {
          stack += `\n${stackTarget.stack.replace(/^.*\n/, '')}`;
        }

        if (cause) {
          stack += `\n  Caused by: ${cause.stack || cause}`;
        }

        return stack.trim();
      },
    });
  }
}

/**
 * An error that has already been printed by the client.
 * @group Errors
 */
export class ClientError extends ClideError {
  constructor(message: string, options?: ClideErrorOptions) {
    super(message, options);
    this.name = 'Error';
  }
}

/**
 * An error indicating the user has done something wrong.
 * @group Errors
 */
export class UsageError extends ClideError {
  constructor(error: any, options?: ClideErrorOptions) {
    super(error, options);
    this.name = 'UsageError';
  }
}

/**
 * An error indicating the user has provided invalid options.
 * @group Errors
 */
export class OptionsError extends UsageError {
  constructor(message: string, options?: ClideErrorOptions) {
    super(message, options);
    this.name = 'OptionsError';
  }
}

/**
 * An error indicating the options config is invalid.
 * @group Errors
 */
export class OptionsConfigError extends ClideError {
  constructor(message: string, options?: ClideErrorOptions) {
    super(message, options);
    this.name = 'OptionsConfigError';
  }
}

/**
 * An error indicating a command is not found.
 * @group Errors
 */
export class NotFoundError extends UsageError {
  constructor(token: string | number, path: string) {
    if (process.env.NODE_ENV === 'development') {
      // In development, show the full path to the command
      super(
        `Unable to find command "${token}" in "${path.replace(/\/?$/, '/')}"`,
      );
    } else {
      // In production, just show the command name
      super(`Command "${token}" not found.`);
    }
    this.name = 'NotFoundError';
  }
}

/**
 * An error indicating a command is missing a default export.
 * @group Errors
 */
export class MissingDefaultExportError extends ClideError {
  constructor(token: string | number, path: string) {
    super(`Missing default export for command "${token}" at "${path}"`);
    this.name = 'MissingDefaultExportError';
  }
}

/**
 * An error indicating a required subcommand is missing.
 * @group Errors
 */
export class RequiredSubcommandError extends UsageError {
  constructor(commandString: string) {
    super(`Subcommand required for command "${commandString}".`);
    this.name = 'RequiredSubcommandError';
  }
}
