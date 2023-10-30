import fs from 'node:fs';

/**
 * Determine if a path is a directory without throwing an error
 * @group Utils
 */
export function isDirectory(path: string): boolean {
  try {
    return fs.statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Determine if an error is a module not found error
 * @group Utils
 */
export function isModuleNotFoundError(err: unknown): boolean {
  return /(Cannot find module|not a directory, stat)/.test(String(err));
}
