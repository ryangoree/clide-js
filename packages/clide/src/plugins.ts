import { ClideClient } from './client';
import { ClideEmitter } from './emitter';
import { Options, Tokens } from './parse';

export interface ClidePlugin {
  meta: {
    name: string;
    version?: string;
    description?: string;
    [key: string]: any;
  };
  init?: (initState: InitState) => void | Promise<void>;
}

export interface InitState {
  readonly client: ClideClient;
  readonly emitter: ClideEmitter;
  readonly plugins: readonly ClidePlugin['meta'][];
  tokens: Tokens;
  options: Options;
}

export function initPlugins(
  plugins: ClidePlugin[],
  initState: InitState,
): Promise<ClidePlugin['meta'][]> {
  return Promise.all(
    plugins.map(async ({ init, meta }) => {
      await init?.(initState);
      return meta;
    }),
  );
}
