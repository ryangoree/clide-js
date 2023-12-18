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
 * Determine if a path is a file without throwing an error
 */
export function isFile(path: string): boolean {
  try {
    return fs.statSync(path).isFile();
  } catch {
    return false;
  }
}
