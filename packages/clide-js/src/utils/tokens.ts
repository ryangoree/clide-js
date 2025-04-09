export type JoinableTokens = string | string[] | JoinableTokens[];

/**
 * Joins multiple command tokens into a single string.
 */
export function joinTokens(...tokens: JoinableTokens[]): string {
  return tokens
    .map((token) =>
      typeof token === 'string'
        ? // If the token contains spaces, wrap it in quotes
          token.includes(' ')
          ? `"${token}"`
          : token
        : joinTokens(...token),
    )
    .join(' ');
}

/**
 * Splits a command string into an array of tokens.
 */
// TODO: Add tests
export function splitTokens(commandString: string): string[] {
  const tokens: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (const token of commandString.split(' ')) {
    if (inQuotes) {
      if (token.endsWith('"')) {
        tokens.push(`${currentToken} ${token.slice(0, -1)}`);
        inQuotes = false;
      } else {
        currentToken += ` ${token}`;
      }
      continue;
    }

    if (token.startsWith('"')) {
      inQuotes = true;
      currentToken = token.slice(1);
    } else {
      tokens.push(token);
    }
  }

  return tokens;
}
