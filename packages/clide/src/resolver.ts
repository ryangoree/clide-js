import fs from 'node:fs';
import path from 'node:path';
import { ClideCommand } from './command';
import {
  ClideError,
  MissingDefaultExportError,
  NotFoundError,
  UsageError,
} from './errors';
import { isDirectory, isModuleNotFoundError } from './utils/fs';
import { Tokens } from './parse';
import { parseFileName } from './utils/parse-file-name';
import { removeFileExtension } from './utils/remove-file-extension';

/**
 * command = 'encode register-call --targets=0x1234,0x5678 --call-datas=0x1234,0x5678'
 */

export type ClideParams = Record<string, string | string[]>;

export interface ResolvedCommand {
  /**
   * The clide command object associated with the resolved command.
   */
  command: ClideCommand;
  /**
   * The path to the resolved command file.
   */
  resolvedCommandPath: string;
  /**
   * The name of the resolved command.
   */
  resolvedCommandName: string;
  /**
   * The remaining tokens that were not resolved.
   */
  remainingTokens: Tokens;
  /**
   * A function to resolve the next command, if any, based on the remaining
   * tokens.
   */
  resolveNext?: () => Promise<ResolvedCommand>;
  /**
   * The params associated with the resolved command.
   */
  params?: ClideParams;
}

const cache = new Map<string, ResolvedCommand>();

/**
 * A map of previously resolved commands, keyed by the command path.
 */
// const memMap = new Map<string, ResolvedCommand>();

/**
 * Resolves a command based on the provided command tokens and directory path.
 *
 * This function attempts to locate a matching command file for the provided
 * command tokens. If found, it imports and returns the associated command. If a
 * command file isn't directly found, it checks if the path is a directory and
 * treats it as a pass-through command, allowing deeper command resolution.
 *
 * If neither a command file nor a directory is found, it checks for
 * parameterized command files (e.g., [param].ts or [...param].ts) in the
 * expected directory and tries to resolve them.
 *
 * The function provides detailed error feedback if the command can't be
 * resolved or if the found module doesn't export a default command.
 *
 * @param tokens - The tokenized command input, used to determine the command or
 * parameterized command file.
 * @param dirPath - Path to the directory containing potential command
 * implementations.
 *
 * @returns Object containing details about the resolved command, the path to
 * the command file, any parameters, and a function to resolve the next command,
 * if any.
 *
 * @throws {ClideError | UsageError | NotFoundError | MissingDefaultExportError}
 * Throws an error if command resolution fails due to missing tokens, command
 * not found, or missing default export.
 */
export async function resolveCommand(
  tokens: Tokens,
  dirPath: string,
): Promise<ResolvedCommand> {
  if (!tokens.length) throw new UsageError('Command required.');

  const cacheKey = `${dirPath}:${tokens.join(':')}`;
  if (cache.has(cacheKey)) {
    console.log('returning cached', cacheKey);
    return cache.get(cacheKey)!;
  }

  const [resolvedCommandName, ...remainingTokens] = tokens;
  const resolvedCommandPath = path.join(dirPath, resolvedCommandName);
  const resolveNext = remainingTokens.length
    ? () => resolveCommand(remainingTokens, resolvedCommandPath)
    : undefined;

  const dirExists = await isDirectory(dirPath);
  if (!dirExists) {
    throw new NotFoundError(resolvedCommandName, dirPath);
  }

  try {
    const { default: command } = await import(resolvedCommandPath);

    if (!command) {
      throw new MissingDefaultExportError(tokens[0], resolvedCommandPath);
    }

    return {
      command,
      resolvedCommandPath,
      resolvedCommandName,
      remainingTokens,
      resolveNext,
    };
  } catch (err: unknown) {
    if (!isModuleNotFoundError(err, resolvedCommandPath)) {
      throw new ClideError(err);
    }

    if (await isDirectory(resolvedCommandPath)) {
      return {
        command: passThroughCommand,
        resolvedCommandPath,
        resolvedCommandName,
        remainingTokens,
        resolveNext,
      };
    }

    // TODO: "Did you mean...?"

    // If the command could not be found, check if there's a param file in the
    // directory where it was expected to be (e.g., [param].ts, [...param].ts)
    const resolvedParamCommand = await resolveParamCommand(tokens, dirPath);
    if (!resolvedParamCommand) {
      throw new NotFoundError(resolvedCommandName, dirPath);
    }

    return resolvedParamCommand;
  }
}

async function resolveParamCommand(
  tokens: Tokens,
  dirPath: string,
): Promise<ResolvedCommand | undefined> {
  const fileNames = await fs.promises.readdir(dirPath);

  // optimization opportunities:
  //   - cache the results of this function
  //   - parse all file names at once
  for (const fileName of fileNames) {
    const { spreadOperator, paramName } = parseFileName(fileName);

    if (!paramName) continue;

    const resolvedCommandName = removeFileExtension(fileName);
    const resolvedCommandPath = path.join(dirPath, resolvedCommandName);
    const remainingTokens = spreadOperator ? [] : tokens.slice(1);
    const resolveNext = remainingTokens.length
      ? () => resolveCommand(remainingTokens, resolvedCommandPath)
      : undefined;
    const params = {
      [paramName]: spreadOperator ? tokens : tokens[0],
    };

    try {
      const { default: command } = await import(resolvedCommandPath);

      if (!command) {
        throw new MissingDefaultExportError(tokens[0], resolvedCommandPath);
      }

      return {
        command,
        resolvedCommandPath,
        resolvedCommandName,
        params,
        remainingTokens,
        resolveNext,
      };
    } catch (err) {
      if (!isModuleNotFoundError(err, resolvedCommandPath)) {
        throw new ClideError(err);
      }

      return {
        command: passThroughCommand,
        resolvedCommandPath,
        resolvedCommandName,
        params,
        remainingTokens,
        resolveNext,
      };
    }
  }
}

const passThroughCommand: ClideCommand = {
  requiresSubcommand: true,
  handler: ({ next, data }) => next(data),
};
