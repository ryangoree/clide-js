// https://regex101.com/r/H6PKtJ/5
const PARAM_FILE_NAME_REGEX = /^\[(\.{3})?([a-zA-Z_][\w-]*)\](\.\w+)?$/;

/**
 * Parses a file name to determine if it's a parameterized command file.
 *
 * Parameterized command files are named using the following format:
 *   - `[param]` - A single parameter with no file extension
 *   - `[param].ts` - A single parameter
 *   - `[...param].ts` - A spread operator parameter
 *
 * @param fileName - The file name to parse.
 *
 * @returns Object containing the spread operator, parameter name, and file
 * extension, if any.
 *
 * @example
 * // A single parameter with no file extension
 * parseFileName('[foo]');
 * // => {
 * //   spreadOperator: undefined,
 * //   paramName: 'foo',
 * //   extension: undefined,
 * // }
 *
 * // A single parameter
 * parseFileName('[foo].ts');
 * // => {
 * //   spreadOperator: undefined,
 * //   paramName: 'foo',
 * //   extension: '.ts',
 * // }
 *
 * // A spread operator parameter
 * parseFileName('[...foo].ts');
 * // => {
 * //   spreadOperator: '...',
 * //   paramName: 'foo',
 * //   extension: '.ts',
 * // }
 *
 * // Not a parameterized command file
 * parseFileName('foo.ts');
 * // => {
 * //   spreadOperator: undefined,
 * //   paramName: undefined,
 * //   extension: undefined,
 * // }
 * 
 * @group Utils
 */
export function parseFileName(fileName: string): {
  spreadOperator: string | undefined;
  paramName: string | undefined;
  extension: string | undefined;
} {
  const [_, spreadOperator, paramName, extension] =
    fileName.match(PARAM_FILE_NAME_REGEX) || [];

  return {
    spreadOperator,
    paramName,
    extension,
  };
}
