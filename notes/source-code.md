# Source Code Overview

_<span style="opacity:.5">A brief overview of the clide-js repo.</span>_

The repo is a yarn [Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) monorepo using
[Turborepo](https://turbo.build/repo/docs). Top level commands are "turbo"
scripts which are added to the root [package.json](https://github.com/ryangoree/clide-js/blob/main/package.json) and configured in
[turbo.json](https://github.com/ryangoree/clide-js/blob/main/turbo.json).

Top level commands are run just like any other yarn project:

```
yarn <script-name>
```

Replace `<script-name>` with the script name from package.json.

To run a command from a workspace (package) located inside the monorepo:

```
yarn workspace <package-name> <script-name>
```

Replace `<package-name>` with the package name located in the package's
package.json.

## Folder Organization

```sh
.github/ # actions and workflows for github
.vscode/ # vscode project settings
assets/ # assets for the README.md
examples/ # example CLIs built with clide-js
notes/ # misc notes
packages/ # package directories
├─ clide-js/ # core package
├─ clide-plugin-command-menu/ # a plugin to prompt users for missing subcommands
├─ esling-config/ # shared eslint config
├─ extras/ # utilities from CLIs I've written in the past that might get used later.
├─ tsconfig/ # shared tsconfig
```

The 2 published packages are [clide-js](https://www.npmjs.com/package/clide-js) and [clide-plugin-command-menu](https://www.npmjs.com/package/clide-plugin-command-menu) 

## Clide-JS Source Code

The [clide-js](https://github.com/ryangoree/clide-js/tree/main/packages/clide-js) package contains the core code for the Clide-JS framework.

## Folder Organization

```sh
src/
├─ cli/ # used as a sandbox to test features, will eventually be a real CLI
├─ core/ # the main code for clide-js
├─ plugins/ # built-in plugins that enable optional features like help
├─ utils/ # utilities used throughout, should not reference any code outside utils
test/
├─ mocks/ # mocking code
├─ src/ # tests for code in src
.gitignore
package.json
tsconfig.json
tsup.config.ts # build config
typedoc.json # docs generator config
vitest.config.ts # testing config
```

Everything revolves around the [context](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/context.ts) module which acts as the orchestrator for the entire command lifecycle, preparing the command for execution, and providing a central method for throwing errors and exiting the process.

It makes use of the other modules in core for most of it's functionality:

- [hooks](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/hooks.ts): Contains the `HooksEmitter` which is used by `Context` and `State` to call hooks from plugins during lifecycle events.
- [client](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/client.ts): Contains a `Client` class for logging and prompting. I would like to build this out more to work with different `stdin`, `stdout`, and `stderr` settings.
- [resolve](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/resolve.ts): Contains functions to locate and import command modules based on a command string.
- [state](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/state.ts):
  Contains the `State` class which manages the state of command execution with
  mechanisms to progress through the steps, handle state transition, and manage
  the lifecycle of shared command data.

The
[state](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/state.ts)
module uses
[options-getter](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/options/options-getter.ts)
to create an `OptionsGetter` for use in command handlers during execution. The
`OptionsGetter` is an object with methods on it for every option with type safe
keys for the option key and it's aliases. These methods are used to dyanamically
fetch option values with optional prompt fallbacks.

The
[help](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/help.ts)
module generates help text for a command context and is used by the built-in
[help
plugin](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/plugins/help.ts).

The
[run](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/run.ts)
module contains  the `run` function which is the primary entry to framework,
used in the bin file of CLIs. It offers a simple unified API for running a CLI with
the Clide-JS framework. It manages registering hooks, creating a
`Context` instance, adding options, preparing and executing the context, and catching
errors.

Lastly in core, the
[command](https://github.com/ryangoree/clide-js/blob/main/packages/clide-js/src/core/command.ts)
module contains a factory function for creating type safe command modules. These
are used in the command files of CLIs and should be their default export.
