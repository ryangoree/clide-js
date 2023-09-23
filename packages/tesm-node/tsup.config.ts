import tsconfigPaths from 'tsconfig-paths';
import { defineConfig } from 'tsup';

tsconfigPaths.register();

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
});
