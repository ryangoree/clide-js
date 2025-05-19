# Contributing to Clide-JS

Thank you for your interest in contributing to Clide-JS! 🥹

If you're unsure where to start, or if a feature would be welcomed, open an
issue and start a conversation.

- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
  - [Working in a Monorepo](#working-in-a-monorepo)
- [Source Code Overview](#source-code-overview)
  - [Folder Organization](#folder-organization)
  - [Clide-JS Source Code](#clide-js-source-code)
    - [Folder Organization](#folder-organization-1)
- [Testing](#testing)
- [Before Opening a PR](#before-opening-a-pr)


## Setup

### Prerequisites

- [Node.js](https://nodejs.org) 22.x
- [Yarn](https://yarnpkg.com)

You can install Node.js using [nvm](https://github.com/nvm-sh/nvm). After
following the [installation
instructions](https://github.com/nvm-sh/nvm#installing-and-updating), run the
following commands to install and use Node.js 22.x:

```sh
nvm install 22
nvm use # run from the root of the project
```

If Yarn is not already installed, you can install it using npm:

```sh
npm install --global yarn
```

### Installing Dependencies

After the prerequisites are installed, install all package and development
dependencies using Yarn:

```sh
yarn  # run from the root of the project
```

### Working in a Monorepo

This repo is a [Yarn
Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) monorepo using
[Turborepo](https://turbo.build/repo/docs). The root
[`package.json`](../package.json) file contains a list of workspaces, each of
which is it's own package with it's own `package.json` file, and `turbo` scripts
which are configured in [turbo.json](../turbo.json).

You can work with the root `package.json` mostly like you would with any other:

```sh
yarn <script-name>

# use the -W flag when installing root dependencies
yarn -W add <package-name>
```

To target a specific package, use the `workspace` command:

```sh
yarn workspace <package-name> <script-name>
yarn workspace <package-name> add <package-name>
```

## Source Code Overview

A brief overview of the clide-js repo.

### Folder Organization

```sh
.changeset/ # changesets and config
.github/ # files for GitHub, including actions and workflows
.vscode/ # VSCode project settings
assets/ # assets for the README.md
examples/ # example CLIs built with clide-js
notes/ # misc notes
packages/ # package directories
├── clide-js/ # core package
├── clide-plugin-command-menu/ # a plugin to prompt users for missing subcommands
└── extras/ # utilities from CLIs I've written in the past that might get used later.
```

The 2 published packages are [clide-js](https://www.npmjs.com/package/clide-js)
and
[clide-plugin-command-menu](https://www.npmjs.com/package/clide-plugin-command-menu)

### Clide-JS Source Code

The [clide-js](../packages/clide-js) package contains the core code for the
Clide-JS framework.

#### Folder Organization

```sh
packages/clide-js/
├── src/
│   ├── cli/ # used as a sandbox to test features, may eventually be a real CLI
│   ├── core/ # the main code for clide-js
│   ├── plugins/ # built-in plugins that enable optional features like help
│   └── utils/ # utilities used throughout, should not reference any code outside utils
├── test/
│   ├── units/ # unit tests
│   └── utils/ # utilities for testing
├── .gitignore
├── CHANGELOG.md # auto-generated changelog from changesets
├── README.md
├── package.json
├── tsconfig.json # typescript config
├── tsup.config.ts # build config
├── typedoc.json # docs generator config
└── vitest.config.ts # testing config
```

Everything revolves around the
[context](../packages/clide-js/src/core/context.ts) module which acts as the
orchestrator for the entire command lifecycle, preparing the command for
execution, and providing a central method for throwing errors and exiting the
process.

It makes use of the other modules in core for most of it's functionality:

- [hooks](../packages/clide-js/src/core/hooks.ts): Contains the `HookRegistry`
  which is used by `Context` and `State` to call hooks from plugins during
  lifecycle events.
- [client](../packages/clide-js/src/core/client.ts): Contains a `Client` class
  for logging and prompting. I would like to build this out more to work with
  different `stdin`, `stdout`, and `stderr` settings.
- [resolve](../packages/clide-js/src/core/resolve.ts): Contains functions to
  locate and import command modules based on a command string.
- [state](../packages/clide-js/src/core/state.ts): Contains the `State` class
  which manages the state of command execution with mechanisms to progress
  through the steps, handle state transition, and manage the lifecycle of shared
  command data.

The [state](../packages/clide-js/src/core/state.ts) module uses
[options-getter](../packages/clide-js/src/core/options/options-getter.ts) to
create an `OptionsGetter` for use in command handlers during execution. The
`OptionsGetter` is an object with methods on it for every option with type safe
keys for the option key and it's aliases. These methods are used to dyanamically
fetch option values with optional prompt fallbacks.

The [help](../packages/clide-js/src/core/help.ts) module generates help text for
a command context and is used by the built-in [help
plugin](../packages/clide-js/src/plugins/help.ts).

The [run](../packages/clide-js/src/core/run.ts) module contains the `run`
function which is the primary entry to framework, used in the bin file of CLIs.
It offers a simple unified API for running a CLI with the Clide-JS framework. It
manages registering hooks, creating a `Context` instance, adding options,
preparing and executing the context, and catching errors.

Lastly in core, the [command](../packages/clide-js/src/core/command.ts) module
contains a factory function for creating type safe command modules. These are
used in the command files of CLIs and should be their default export.

## Testing

To run all tests, use the `test` script in the root `package.json`:

```sh
yarn test
```

To run tests for a specific package, use the `workspace` command:

```
yarn workspace <package-name> test
```

## Before Opening a PR

This repo uses [changesets](https://github.com/changesets/changesets) to manage
versioning and changelogs.

Before opening a PR, run:

```sh
yarn changeset
```

Follow the prompts to describe the changes you've made using the
[semver](https://semver.org/) versioning scheme and commit the generated
changeset file.
