/**
 * Added to every error name.
 * @internal
 */
export const ERROR_PREFIX = '✖ ';

/**
 * An error thrown by the CLI engine.
 * @group Errors
 */
export class ClideError extends Error {
  constructor(error: any) {
    // Coerce the error to a string, or throw the original error if unable.
    let message: string;
    try {
      message = error?.message ?? String(error);
    } catch {
      throw error;
    }
    super(message);

    this.name = 'CLI Error';

    const isError = error instanceof Error;
    let originalName: string | undefined;
    let originalError: Error = error;

    // Get the original custom error name, if available.
    if (error?.name && error.name !== 'Error') {
      originalName = error.name;
    } else if (isError && error.constructor.name !== 'Error') {
      originalName = error.constructor.name;
    }

    // If it's not an error instance, create one to capture the stack.
    if (!isError) {
      originalError = new Error();
      Error.captureStackTrace(originalError, new.target);
    }

    // Copy the stack from the original error, but modify the first line which
    // contains the error name and message.
    Object.defineProperty(this, 'stack', {
      get(): string {
        let stack = `${ERROR_PREFIX}${this.name}`;

        if (originalName) {
          stack += ` [${originalName}]`;
        }

        if (this.message) {
          stack += `: ${this.message}`;
        }

        if (originalError.stack) {
          stack += `\n${originalError.stack.replace(/^.*\n/, '')}`;
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
  constructor(message: string) {
    super(message);
    this.name = 'Error';
  }
}

/**
 * An error indicating the user has done something wrong.
 * @group Errors
 */
export class UsageError extends ClideError {
  constructor(error: any) {
    super(error);
    this.name = 'UsageError';
  }
}

/**
 * An error indicating the user has provided invalid options.
 * @group Errors
 */
export class OptionsError extends UsageError {
  constructor(message: string) {
    super(message);
    this.name = 'OptionsError';
  }
}

/**
 * An error indicating the options config is invalid.
 * @group Errors
 */
export class OptionsConfigError extends ClideError {
  constructor(message: string) {
    super(message);
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
