import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'test-utils': 'test/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
