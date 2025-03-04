/**
 * Joins an array of command tokens into a single string.
 */
export function joinTokens(tokens: string | string[]): string {
  if (typeof tokens === 'string') return tokens;
  return (
    tokens
      // If the token contains spaces, wrap it in quotes
      .map((token) => (token.includes(' ') ? `"${token}"` : token))
      .join(' ')
  );
}

/**
 * Splits a command string into an array of tokens.
 */
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
