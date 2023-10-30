/**
 * Removes the file extension from a string.
 * 
 * @example
 * removeFileExtension('foo.txt') // 'foo'
 * 
 * @group Utils
 */
export function removeFileExtension(str: string): string {
  return str.replace(/(?<!\.)\.[^.]+$/, '');
}
