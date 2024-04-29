import { removeFileExtension } from './remove-file-extension';

/**
 * Formats a file name to ensure it ends with `.js`.
 * @group Resolve
 */
export function formatFileName(fileName: string) {
  return `${removeFileExtension(fileName)}.js`;
}
