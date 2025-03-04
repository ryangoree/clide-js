# clide-js

## 0.2.7

### Patch Changes

- e340a78: Patched option type

## 0.2.6

### Patch Changes

- a6212d1: Added a `choices` field to option configs which will default to a `"select"` prompt when triggered.
- d7536ba: Added a default prompt for missing required options as explained in the README. Previously, the prompt would only show if explicitly provided in the getter options.

## 0.2.5

### Patch Changes

- 02e2b65: Fixed prompt types by adding missing `@types/prompts` dependency.
- 02e2b65: General types and error formatting polish

## 0.2.4

### Patch Changes

- 5c81fa1: Polished up the `HooksEmitter` types and doc comments
- e13a262: Simplify `command` type params

## 0.2.3

### Patch Changes

- 5b3a7ef: Bumped deps
- 8fa42e2: Changed the default bahavior of `autocomplete` and `autocompleteMultiselect` prompt options to include the current input as one of the choices.

## 0.2.2

### Patch Changes

- d675d46: Fixed error output which previously buried the stack trace in minified code.

## 0.2.1

### Patch Changes

- a6f728a: Added `option` factory function for creating strongly typed options. This is especially useful when defining shared options outside of the `command` factory function.

## 0.2.0

### Minor Changes

- 2eb1489:
  - Polished up internal ✨**test utils**✨ and added them to the exports so you can easily test you're CLIs and plugins!
  - Made the `logger` plugin more full featured with `prefix`, `logFile`, and `enabled` options, and util functions for enabling/disabling the logger during runtime.
  - Added `formatFileName` util function to exports.
  - Added getters to `State` for `client`, ... so they can be accessed without needing to go through through `Context`.
  - Made the `Hooks` type a generic which takes a `HooksObject` type param.
  - Made the `PluginInfo` type a generic which takes a `PluginMeta` type param.
  - Renamed `StateOptions.data` to `StateOptions.initialData`.
  - Refactored command resolution to ignore relative paths.
  - Fixed the `optionValues` type on `State.fork` to work with command types that have an optional `options` field.

## 0.1.5

### Patch Changes

- ae0a2a8: Removed the unimplemented option config param `prompt`. Implemented the previously unimplemented option config param `nargs`.
- ae0a2a8: Implemented strong types for the `fork` method's `optionValues` field.

## 0.1.4

### Patch Changes

- a374cd6: - Removed the unimplemented option config param `prompt`.
  - Implemented the previously unimplemented option config param `nargs`.
- ad4ad30: Implemented strong types for the `fork` method's `optionValues` field.

## 0.1.3

### Patch Changes

- d1980be: Added a `string` field to options config to control how numberish values are parsed in array options
