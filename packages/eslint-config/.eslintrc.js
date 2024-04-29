const path = require('path');

const project = path.resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',

    /**
     * Prettier must be the last extension in the list.
     * Prettier works best if you disable all other ESLint rules relating to
     * code formatting, and only enable rules that detect potential bugs.
     * (If another active ESLint rule disagrees with prettier about how code
     * should be formatted, it will be impossible to avoid lint errors.)
     */
    'prettier',
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
