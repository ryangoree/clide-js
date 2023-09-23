import parse from 'yargs-parser';

export type Tokens = string[];
export type Options = {
  [x: string]: unknown;
};

export async function parseCommand(command: string | string[]): Promise<{
  tokens: Tokens;
  options: Options;
}> {
  const { _: tokens, ...options } = await parse(command);
  console.log({ tokens, options });
  return {
    tokens: tokens.map(String),
    options,
  };
}

// export function parse()