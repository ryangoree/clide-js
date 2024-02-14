/**
 * Removes the file extension from a string and treats multiple dots in a row as
 * part of the file name.
 * 
 * @example
 * removeFileExtension('foo.txt') // 'foo'
 * 
 * @group Utils
 */
export function removeFileExtension(str: string): string {
  return str.replace(/(?<!\.)\.[^.]+$/, '');
}
