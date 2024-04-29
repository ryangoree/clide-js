import fs from 'fs';
import path from 'path';

/**
 * Get the path to the nearest app root directory based on the presence of a
 * `package.json` file.
 * @param dirPath - The directory to start searching from. Defaults to the
 * current working directory.
 */
export function getAppRootDir(dirPath: string = process.cwd()): string {
  const dirItems = fs.readdirSync(dirPath);

  if (!dirItems.includes('package.json')) {
    return getAppRootDir(path.dirname(dirPath));
  }

  return dirPath;
}
