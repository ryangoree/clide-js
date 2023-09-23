declare interface ResolveContext {
  conditions: string[];
  importAssertions: Record<string, unknown>;
  parentURL: string;
}

declare module 'ts-node/esm' {
  declare const resolve: (
    specifier: string,
    context: ResolveContext,
    defaultResolver: unknown,
  ) => unknown;
  declare const getFormat;
  declare const transformSource;
  declare const load;
}
