import initCliui from 'cliui';
import fs from 'node:fs';
import { ClideCommandOption } from './options';
import { ResolvedCommand, resolveCommand } from './resolver';
import { getBin } from './utils/argv';
import { isDirectory } from './utils/fs';
import { Tokens } from './parse';
import { parseFileName } from './utils/parse-file-name';
import { removeFileExtension } from './utils/remove-file-extension';

const cliui = initCliui({
  width: 80,
  wrap: true,
});

const BASE_INDENT = 2;

export interface GetHelpOptions {
  /**
   * The tokens extracted from the user's input. Represents commands,
   * subcommands, or parameters.
   */
  tokens: Tokens;
  /**
   * Directory path where command definitions are stored.
   */
  commandsDir: string;
}

export interface Help {
  /**
   * The help information for the provided command.
   */
  helpText: string;
  /**
   * The error message, if any, that occurred while trying to resolve the
   * command.
   */
  error?: Error;
}

/**
 * Displays the help information for a given command based on the provided
 * tokens.
 *
 * The function constructs a dynamic usage string based on the resolved commands
 * and their parameters, then presents this information along with the
 * description, available options, and subcommands. The visual output is
 * structured using 'cliui' for better formatting in the terminal.
 *
 * @param options - Configuration parameters for generating the help.
 *
 * @returns A promise that resolves when the help has been displayed.
 *
 * @example
 * // To display help for the 'hello' command:
 * getHelp({
 *   tokens: ['hello'],
 *   commandsDir: './commands',
 *   client: new ClideClient(),
 * }) // => { helpText: '...', error: undefined };
 */
export async function getHelp({
  tokens,
  commandsDir,
}: GetHelpOptions): Promise<Help> {
  const rows: HelpRows = {
    usage: {
      text: `Usage: ${getBin().replace(process.cwd(), '')}`,
      padding: [1, 0, 0, 0],
    },
    optionsTitle: {
      text: 'OPTIONS:',
      padding: [1, 0, 0, 0],
    },
    options: [],
  };

  let error: unknown;
  let resolved: ResolvedCommand | undefined = tokens.length
    ? await resolveCommand(tokens, commandsDir).catch((err) => {
        error = err;
        return undefined;
      })
    : undefined;

  function addResolvedToUsageString() {
    if (resolved?.params) {
      const { paramName, spreadOperator } = parseFileName(
        resolved.resolvedCommandName,
      );
      const tokenUsage = `<${paramName}${spreadOperator ? ' ...' : ''}>`;
      rows.usage.text += ` ${tokenUsage}`;
    } else if (resolved) {
      rows.usage.text += ` ${resolved.resolvedCommandName}`;
    }
  }

  // Add tokens to usage string
  while (resolved?.resolveNext) {
    try {
      const nextResolved = await resolved.resolveNext();
      addResolvedToUsageString();
      resolved = nextResolved;
    } catch (err) {
      error = err;
      break;
    }
  }

  // Add last token to usage string
  addResolvedToUsageString();

  // Add description row
  if (resolved?.command.description) {
    rows.description = {
      text: resolved.command.description,
      padding: [1, 0, 0, 0],
    };
  }

  let hasRequiredOptions = false;
  const options = {
    ...resolved?.command.options,
    help: helpOption,
  };

  const optionEntries = Object.entries(options);
  const firstColWidths = new Set<number>();

  // Create cliui columns for each option
  rows.options = rows.options.concat(
    optionEntries.map(([optionName, option]) => {
      let singleLetterKeys = [];
      let wordKeys = [];

      if (optionName.length === 1) {
        singleLetterKeys.push(optionName);
      } else {
        wordKeys.push(optionName);
      }

      for (const alias of option.alias || []) {
        if (alias.length === 1) {
          singleLetterKeys.push(alias);
        } else {
          wordKeys.push(alias);
        }
      }

      singleLetterKeys.sort();
      wordKeys.sort();

      let optionString = [
        ...singleLetterKeys.map((key) => `-${key}`),
        ...wordKeys.map((key) => `--${key}`),
      ].join(', ');

      let optionValue: string | undefined;

      switch (option.type) {
        case 'string':
          optionValue = 'string';
          break;
        case 'number':
          optionValue = 'number';
          break;
        case 'array':
          optionValue = 'string ...';
      }

      const isRequired = !!option.required && !option.default;
      hasRequiredOptions = hasRequiredOptions || isRequired;

      if (optionValue) {
        optionString += isRequired ? ` <${optionValue}>` : ` [${optionValue}]`;
      }

      let leftPadding = BASE_INDENT;
      if (!singleLetterKeys.length) leftPadding += 4;

      firstColWidths.add(optionString.length + leftPadding);

      return [
        {
          text: optionString,
          padding: [0, 0, 0, leftPadding],
        },
        {
          text: `${option.description || ''}${
            option.default ? ` (default: ${option.default})` : ''
          }`,
          padding: [0, 0, 0, 3],
        },
      ];
    }),
  );

  const firstColWidth = Math.min(Math.max(...firstColWidths), 40);

  // Set the width of the first column of each option span to the max width
  for (const [firstCol] of rows.options) {
    firstCol.width = firstColWidth;
  }

  let hasSubcommands = await isDirectory(
    resolved?.resolvedCommandPath || commandsDir,
  );

  // Add subcommand rows
  if (hasSubcommands) {
    Object.assign(rows, await commandRows(resolved, commandsDir));
  }

  if (hasSubcommands && !resolved?.command.middleware) {
    rows.usage.text += hasRequiredOptions
      ? ' (<OPTIONS> | <COMMAND>)'
      : ' ([OPTIONS] | [COMMAND])';
  } else {
    rows.usage.text += hasRequiredOptions ? ' <OPTIONS>' : ' [OPTIONS]';

    if (hasSubcommands) {
      rows.usage.text += resolved?.command.requiresSubcommand
        ? ' <COMMAND>'
        : ' [COMMAND]';
    }
  }

  // Add rows to cliui
  cliui.div(rows.usage);
  if (rows.description) cliui.div(rows.description);

  cliui.div(rows.optionsTitle);
  for (const cols of rows.options) {
    cliui.div(...cols);
  }

  if (rows.subcommandsTitle) cliui.div(rows.subcommandsTitle);

  if (rows.subcommands) {
    for (const cols of rows.subcommands) {
      cliui.div(...cols);
    }
  }

  // Add empty line to cliui
  cliui.div({ text: '', padding: [0, 0, 0, 0] });

  return {
    helpText: cliui.toString(),
    error:
      error === undefined
        ? undefined
        : error instanceof Error
        ? error
        : new Error(String(error)),
  };
}

const helpOption: ClideCommandOption = {
  type: 'boolean',
  alias: ['h'],
  description: 'Display help information',
};

async function commandRows(
  resolved: ResolvedCommand | undefined,
  commandsDir: string,
): Promise<Partial<HelpRows>> {
  // Add subcommands header row
  const rows: Partial<HelpRows> = {
    subcommandsTitle: {
      text: 'COMMANDS:',
      padding: [1, 0, 0, 0],
    },
  };

  const subcommandsDir = resolved?.resolvedCommandPath || commandsDir;
  const subcommandFileNames = await fs.promises.readdir(subcommandsDir);
  const subcommandNames = Array.from(
    // remove file extensions, duplicates, and 'index'
    new Set<string>(
      subcommandFileNames
        .map(removeFileExtension)
        .filter((name) => name !== 'index'),
    ),
  );
  if (subcommandNames.length === 0) {
    return {};
  }
  const firstColWidths = new Set<number>();

  // Create cliui columns for each subcommand
  rows.subcommands = await Promise.all(
    subcommandNames.map(async (subcommand) => {
      const {
        command: { description },
      } = await resolveCommand([subcommand], subcommandsDir);

      firstColWidths.add(subcommand.length + BASE_INDENT);

      return [
        {
          text: subcommand,
          padding: [0, 0, 0, BASE_INDENT],
        },
        {
          text: description || '',
          padding: [0, 0, 0, 3],
        },
      ];
    }),
  );

  const firstColWidth = Math.min(Math.max(...firstColWidths), 40);

  // Set the width of the first column of each subcommand span to the max width
  for (const [firstCol] of rows.subcommands) {
    firstCol.width = firstColWidth;
  }

  return rows;
}

type Column = Exclude<Parameters<typeof cliui.div>[0], string>;

interface HelpRows {
  // in order of appearance
  usage: Column;
  description?: Column;
  optionsTitle: Column;
  options: [Column, Column][];
  subcommandsTitle?: Column;
  subcommands?: [Column, Column][];
}
