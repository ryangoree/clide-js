import fs from 'node:fs';

export function isDirectory(path: string): Promise<boolean> {
  return fs.promises
    .stat(path)
    .then((stat) => stat.isDirectory())
    .catch(() => false);
}

export function isModuleNotFoundError(err: unknown, path?: string): boolean {
  const regex = new RegExp(
    `(Cannot find module|not a directory, stat) ${
      `'${path?.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}(\\.\\w+)?'` || '.*?'
    }`,
  );
  return regex.test(String(err));
}
