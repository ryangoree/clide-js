import { resolve as resolveTs } from 'ts-node/esm';

let matchPath: (path: string) => string | undefined = (path: string) => path;
let hasTSConfigPaths = false;

// Optionally load tsconfig-paths to resolve path aliases from tsconfig.
try {
  const tsConfigPaths = await import('tsconfig-paths');

  hasTSConfigPaths = true;
  const config = tsConfigPaths.loadConfig();

  if (!('absoluteBaseUrl' in config)) {
    throw 'Unable to load tsconfig';
  }

  // Create a path matcher fn using the base url and paths from tsconfig.
  matchPath = tsConfigPaths.createMatchPath(
    config.absoluteBaseUrl,
    config.paths,
  );
} catch (err) {}

// Re-use these functions from the ts-node/esm loader.
export { getFormat, load, transformSource } from 'ts-node/esm';

// Use a custom resolver for import paths.
export async function resolve(
  specifier: string,
  context: ResolveContext,
  defaultResolver: unknown,
) {
  // See if the path matches one of the paths from tsconfig.
  specifier = matchPath(specifier) || specifier;

  // Try to resolve the path with ts-node/esm.
  try {
    return await resolveTs(specifier, context, defaultResolver);
  } catch (err) {
    // If it matches and is missing a file extension, append .js to it.
    // Extensions are required in es modules.
    // see: https://nodejs.org/api/esm.html#mandatory-file-extensions
    if (isMissingExtension(specifier)) {
      try {
        return await resolveTs(`${specifier}.js`, context, defaultResolver);
      } catch (err) {
        if (!isDirImportError(err)) throw err;

        // If it fails to resolve a file and there's a directory with the same
        // name, try to resolve the index file in the directory.
        return (
          resolveTs(`${specifier}/index.js`, context, defaultResolver) as any
        ).catch(() => {
          // If it fails to resolve the index file, throw the original error to
          // avoid confusing the user.
          throw err;
        });
      }
    }

    if (!hasTSConfigPaths) {
      const msg = (err as Error).message.replace(
        /(^[^\n\r]*)[.\s\n\r]*/g,
        '$1',
      );
      console.error(`\n${redLog(boldLog('Module Resolver Error:'))}`);
      console.error(`${redLog('-')} ${msg}`);
      console.error(
        `${redLog(
          '-',
        )} If you're trying to import a module using a path configured in tsconfig, ensure \u001b[1mtsconfig-paths\u001b[0m is installed (\u001b[1mnpm i -D tsconfig-paths\u001b[0m)\n`,
      );
      process.exit(1);
    }

    // otherwise if it has an extension and failed to resolve, throw the error
    throw err;
  }
}

/**
 * Make console text red.
 * @param {string} msg
 * @returns {string}
 */
function redLog(msg: string) {
  return `\u001b[31m${msg}\u001b[0m`;
}

/**
 * Make console text bold.
 * @param {string} msg
 * @returns {string}
 */
function boldLog(msg: string) {
  return `\u001b[1m${msg}\u001b[0m`;
}

/**
 * Check if a path ends with `".*"`
 * @param {string} path
 * @returns {boolean}
 */
function isMissingExtension(path: string) {
  return !/\.\w+$/.test(path);
}

/**
 * Check if an error is a module not found error.
 * @param err - The error to check.
 * @returns {boolean}
 */
function isDirImportError(err: any) {
  return /ERR_UNSUPPORTED_DIR_IMPORT/.test(err.toString());
}
