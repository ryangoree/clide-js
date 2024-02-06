/**
 * Added to every error name.
 * @ignore
 */
export const ERROR_PREFIX = '✖ ';

/**
 * An error thrown by the CLI engine.
 * @group Errors
 */
export class ClideError extends Error {
  private _name: string;

  constructor(error: any) {
    // Ensure the error can be converted into a primitive type which is required
    // for the `Error` constructor.
    try {
      String(error);
    } catch {
      throw error;
    }
    super(error?.message || error);
    this._name = `${ERROR_PREFIX}CLI Error`;
  }

  // Override the default getter/setter to ensure the prefix is always present
  get name() {
    return this._name;
  }
  set name(name: string) {
    this._name = ensurePrefix(name);
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

const PREFIX_REGEX = new RegExp(`^${ERROR_PREFIX}`);

/**
 * Adds the prefix to the string if it doesn't already have it.
 */
function ensurePrefix(str: string) {
  return `${ERROR_PREFIX}${str.replace(PREFIX_REGEX, '')}`;
}
