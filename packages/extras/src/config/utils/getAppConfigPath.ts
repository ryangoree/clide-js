import fs from 'fs';
import path from 'path';
import { getAppRootDir } from './getAppRootDir';

export const DEFAULT_CONFIG_FILE_NAME = 'clide.config';

export interface GetAppConfigPathOptions<TUseDefault extends boolean = true> {
  /**
   * The directory to start searching from. Defaults to the current working
   * directory.
   */
  dirPath?: string;
  /**
   * Whether or not to use the default config file name if an existing config
   * file is not found.
   */
  useDefault?: TUseDefault;
}

/**
 * Get the path to the nearest clide config file.
 */
export function getAppConfigPath<TUseDefault extends boolean = true>({
  dirPath = process.cwd(),
  useDefault = true as TUseDefault,
}: GetAppConfigPathOptions<TUseDefault> = {}): IfElse<
  TUseDefault,
  string,
  string | undefined
> {
  const appRootDir = getAppRootDir(dirPath);
  const dirItems = fs.readdirSync(appRootDir);

  // https://regex101.com/r/uwespR/1
  const existingFileName = dirItems.find(
    /^clide\.config\.((m|c)?js|(m|c)?ts|json)$/.test,
  );

  if (!existingFileName && !useDefault) {
    return undefined as IfElse<TUseDefault, string, string | undefined>;
  }

  return path.join(appRootDir, existingFileName || DEFAULT_CONFIG_FILE_NAME);
}

type IfElse<TCondition extends boolean, TTrue, TFalse> = TCondition extends true
  ? TTrue
  : TFalse;
