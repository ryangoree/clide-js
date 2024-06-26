---
"clide-js": minor
---

- Polished up internal ✨**test utils**✨ and added them to the exports so you can easily test you're CLIs and plugins!
- Made the `logger` plugin more full featured with `prefix`, `logFile`, and `enabled` options, and util functions for enabling/disabling the logger during runtime.
- Added `formatFileName` util function to exports.
- Added getters to `State` for `client`, ... so they can be accessed without needing to go through through `Context`.
- Made the `Hooks` type a generic which takes a `HooksObject` type param.
- Made the `PluginInfo` type a generic which takes a `PluginMeta` type param.
- Renamed `StateOptions.data` to `StateOptions.initialData`.
- Refactored command resolution to ignore relative paths.
- Fixed the `optionValues` type on `State.fork` to work with command types that have an optional `options` field.