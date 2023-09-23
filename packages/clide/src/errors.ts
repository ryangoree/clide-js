export const ERROR_PREFIX = '✖ ';

export class ClideError extends Error {
  private _name: string;

  constructor(error: any) {
    super(error?.message || error);
    this._name = `${ERROR_PREFIX}ClideError`;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = ensurePrefix(name);
  }
}

export class UsageError extends ClideError {
  constructor(error: any) {
    super(error);
    this.name = 'UsageError';
  }
}

export class NotFoundError extends UsageError {
  constructor(command: string | number, path: string) {
    if (process.env.NODE_ENV === 'development') {
      super(
        `Unable to find command "${command}" in "${path.replace(/\/?$/, '/')}"`,
      );
    } else {
      super(`Command "${command}" not found.`);
    }
    this.name = 'NotFoundError';
  }
}

export class MissingDefaultExportError extends UsageError {
  constructor(command: string | number, path: string) {
    super(`Missing default export for command "${command}" at "${path}"`);
    this.name = 'MissingDefaultExportError';
  }
}

const PREFIX_REGEX = new RegExp(`^${ERROR_PREFIX}`);

/**
 * Adds the prefix to the string if it doesn't already have it.
 */
function ensurePrefix(str: string) {
  return `${ERROR_PREFIX}${str.replace(PREFIX_REGEX, '')}`;
}
