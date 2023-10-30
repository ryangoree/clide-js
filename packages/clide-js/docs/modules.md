[clide-js](README.md) / Exports

# clide-js

## Table of contents

### Run

- [RunOptions](interfaces/RunOptions.md)
- [run](modules.md#run)

### Command

- [CommandHandler](modules.md#commandhandler)
- [CommandModule](modules.md#commandmodule)
- [passThroughCommand](modules.md#passthroughcommand)
- [command](modules.md#command)

### State

- [State](classes/State.md)
- [NextState](interfaces/NextState.md)

### Context

- [Context](classes/Context.md)
- [ContextOptions](interfaces/ContextOptions.md)

### Client

- [Client](classes/Client.md)
- [PromptOptions](modules.md#promptoptions)

### Plugin

- [Plugin](interfaces/Plugin.md)
- [PluginInfo](interfaces/PluginInfo.md)

### Hooks

- [HooksEmitter](classes/HooksEmitter.md)
- [Hooks](interfaces/Hooks.md)
- [HookPayload](modules.md#hookpayload)

### Help

- [HelpRows](interfaces/HelpRows.md)
- [Help](modules.md#help)
- [getHelp](modules.md#gethelp)

### Errors

- [ClideError](classes/ClideError.md)
- [ClientError](classes/ClientError.md)
- [MissingDefaultExportError](classes/MissingDefaultExportError.md)
- [NotFoundError](classes/NotFoundError.md)
- [OptionsConfigError](classes/OptionsConfigError.md)
- [OptionsError](classes/OptionsError.md)
- [RequiredSubcommandError](classes/RequiredSubcommandError.md)
- [UsageError](classes/UsageError.md)

### Resolve

- [ResolveCommandOptions](interfaces/ResolveCommandOptions.md)
- [ResolvedCommand](interfaces/ResolvedCommand.md)
- [Params](modules.md#params)
- [ResolveCommandFn](modules.md#resolvecommandfn)
- [formatFileName](modules.md#formatfilename)
- [prepareResolvedCommand](modules.md#prepareresolvedcommand)
- [resolveCommand](modules.md#resolvecommand)

### Parse

- [OptionValues](modules.md#optionvalues)
- [ParseCommandFn](modules.md#parsecommandfn)
- [ParsedCommand](modules.md#parsedcommand)
- [Tokens](modules.md#tokens)
- [parseCommand](modules.md#parsecommand)

### Options

- [OptionConfig](interfaces/OptionConfig.md)
- [OptionGetter](modules.md#optiongetter)
- [OptionPrimitiveType](modules.md#optionprimitivetype)
- [OptionType](modules.md#optiontype)
- [OptionsConfig](modules.md#optionsconfig)
- [OptionsGetter](modules.md#optionsgetter)
- [createOptionGetter](modules.md#createoptiongetter)
- [createOptionsGetter](modules.md#createoptionsgetter)
- [removeOptionTokens](modules.md#removeoptiontokens)
- [validateOptionType](modules.md#validateoptiontype)
- [validateOptions](modules.md#validateoptions)
- [validateOptionsConfig](modules.md#validateoptionsconfig)

### Plugins

- [help](modules.md#help-1)
- [logger](modules.md#logger)

### Utils

- [CamelCase](modules.md#camelcase)
- [camelCase](modules.md#camelcase-1)
- [findSimilar](modules.md#findsimilar)
- [getBin](modules.md#getbin)
- [getCallerPath](modules.md#getcallerpath)
- [hideBin](modules.md#hidebin)
- [isDirectory](modules.md#isdirectory)
- [isModuleNotFoundError](modules.md#ismodulenotfounderror)
- [parseFileName](modules.md#parsefilename)
- [removeFileExtension](modules.md#removefileextension)

## Run

• **RunOptions**: `Object`

Options for the [`run`](modules.md#run) function.

#### Defined in

[core/run.ts:14](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L14)

### run

▸ **run**(`«destructured»?`): `Promise`\<`unknown`\>

Run a command with optional plugins and dynamic command discovery.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RunOptions`](interfaces/RunOptions.md) |

#### Returns

`Promise`\<`unknown`\>

The result of the executed command.

**`Example`**

```ts
run({
  command: 'build ./src --watch --env=prod',
  plugins: [help]
});
```

**`Remarks`**

If no commands directory is provided, this function will try to find one by
first looking for a "commands" directory in the current working directory,
then looking for a "commands" directory adjacent to the file that called this
function.

For example, if the node process is started from the root of a project and
this function is called from a file at "src/cli.js", it will look for a
"commands" directory in the root of the project and in the "src" directory.

#### Defined in

[core/run.ts:94](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L94)

## Command

### CommandHandler

Ƭ **CommandHandler**\<`TData`, `TOptions`\>: (`state`: `Readonly`\<[`State`](classes/State.md)\<`TData`, `TOptions`\>\>) => `MaybePromise`\<`unknown`\>

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TData` | `unknown` | Optional type for data specific to this command. |
| `TOptions` | extends [`OptionsConfig`](modules.md#optionsconfig) = [`OptionsConfig`](modules.md#optionsconfig) | The `OptionsConfig` type for the command. |

#### Type declaration

▸ (`state`): `MaybePromise`\<`unknown`\>

A command handler function that receives the current state and performs
some action.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Readonly`\<[`State`](classes/State.md)\<`TData`, `TOptions`\>\> | The current state of the CLI engine. |

##### Returns

`MaybePromise`\<`unknown`\>

#### Defined in

[core/command.ts:95](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/command.ts#L95)

___

### CommandModule

Ƭ **CommandModule**\<`TData`, `TOptions`\>: `Object`

A command module that can be executed by the CLI engine.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TData` | `unknown` | Optional type for data specific to this command. |
| `TOptions` | extends [`OptionsConfig`](modules.md#optionsconfig) = [`OptionsConfig`](modules.md#optionsconfig) | The `OptionsConfig` type for the command. |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `description?` | `string` | A description of the command that will be displayed in the help menu. |
| `handler` | [`CommandHandler`](modules.md#commandhandler)\<`TData`, `TOptions`\> | The command handler. This is where the command's logic is executed. |
| `isMiddleware?` | `boolean` | If `true`, the command will be executed before the next command in the chain. **`Default`** ```ts true ``` |
| `options?` | `TOptions` | The options config for the command. |
| `requiresSubcommand?` | `boolean` | If `true`, the command will require a subcommand to be executed. **`Default`** ```ts false ``` |

#### Defined in

[core/command.ts:11](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/command.ts#L11)

___

### passThroughCommand

• `Const` **passThroughCommand**: [`CommandModule`](modules.md#commandmodule)

A command handler that simply passes the data to the next command in the
chain, requiring a subcommand to pass the data to.

#### Defined in

[core/command.ts:105](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/command.ts#L105)

___

### command

▸ **command**\<`TData`, `TOptionsKey`, `TOptionsType`, `TOptions`\>(`options`): `Object`

Factory function to create a Command object with strong typing. This is
used to define a command with its associated metadata, options, and handler
logic.

The function is generic and can be used to define a command with custom
types, but it's recommended to allow TypeScript to infer the types based on
the options passed to the function.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TData` | `unknown` | Optional type for data specific to this command. |
| `TOptionsKey` | extends `string` = `string` | The string keys representing option names. |
| `TOptionsType` | extends [`OptionType`](modules.md#optiontype) = [`OptionType`](modules.md#optiontype) | The possible option types (e.g., 'string', 'number'). |
| `TOptions` | extends [`OptionsConfig`](modules.md#optionsconfig)\<`TOptionsKey`, `TOptionsType`\> = [`OptionsConfig`](modules.md#optionsconfig)\<`TOptionsKey`, `TOptionsType`\> | The `OptionsConfig` type that represents all options for the command. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`\<[`CommandModule`](modules.md#commandmodule)\<`TData`, `TOptions`\>\> | The config for constructing the Command. |

#### Returns

`Object`

A constructed `Command` object with strong types.

| Name | Type | Description |
| :------ | :------ | :------ |
| `description?` | `string` | A description of the command that will be displayed in the help menu. |
| `handler?` | [`CommandHandler`](modules.md#commandhandler)\<`TData`, `TOptions`\> | The command handler. This is where the command's logic is executed. |
| `isMiddleware` | `boolean` | - |
| `options?` | `TOptions` | The options config for the command. |
| `requiresSubcommand` | `boolean` | - |

#### Defined in

[core/command.ts:60](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/command.ts#L60)

## Client

• **Client**: `Object`

A client that can be used to log messages, errors, and prompt the user.

This is a **WIP** and will be built out more in the future. For now, it's
just a simple wrapper around `console` and
[prompts](https://github.com/terkelg/prompts).

#### Defined in

[core/client.ts:31](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L31)

### PromptOptions

Ƭ **PromptOptions**: `Omit`\<`prompts.PromptObject`, ``"name"`` \| ``"message"`` \| ``"separator"``\> & \{ `message`: `NonNullable`\<`prompts.PromptObject`[``"message"``]\>  }

Variation of `prompts.PromptObject` with a few changes:
- name must be a string
- message is required
- separator is always ','

**`See`**

https://github.com/terkelg/prompts#-prompt-objects

#### Defined in

[core/client.ts:14](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L14)

## Hooks

• **HooksEmitter**: `Object`

A class for registering, un-registering, and calling hooks. The hooks called
by the CLI engine are defined in the [`Hooks`](interfaces/Hooks.md) type, but any string
can be used as a hook name, allowing plugins to define their own hooks.

**`Remarks`**

Each registered hook handler is awaited in series to ensure that hooks are
called in the order they were registered.

#### Defined in

[core/hooks.ts:249](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L249)

• **Hooks**: `Object`

The hooks that can be used to customize the CLI engine.

#### Defined in

[core/hooks.ts:12](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L12)

### HookPayload

Ƭ **HookPayload**\<`THook`\>: `Parameters`\<[`Hooks`](interfaces/Hooks.md)[`THook`]\>[``0``]

A generic type for the payload of a hook.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends keyof [`Hooks`](interfaces/Hooks.md) |

#### Defined in

[core/hooks.ts:234](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L234)

## Help

• **HelpRows**: `Object`

The rows that make up the help information for a command. In order of
appearance, the rows are:
- description
- usage
- optionsTitle
- options
- subcommandsTitle
- subcommands

#### Defined in

[core/help.ts:32](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L32)

### Help

Ƭ **Help**: \{ `error?`: `Error` ; `helpText`: `string`  } & `Converted`\<[`HelpRows`](interfaces/HelpRows.md), `Column`, `string`\>

The help information for a given command.

#### Defined in

[core/help.ts:63](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L63)

___

### getHelp

▸ **getHelp**(`context`): `Promise`\<[`Help`](modules.md#help)\>

Generates the help information for a given command based on the provided
tokens.

This function constructs a dynamic usage string based on the resolved commands
and their parameters, then formats this information along with the
description, available options, and subcommands. The output is structured
using `cliui` for better formatting in the terminal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](classes/Context.md)\<[`OptionsConfig`](modules.md#optionsconfig)\> | The context object for the command. |

#### Returns

`Promise`\<[`Help`](modules.md#help)\>

#### Defined in

[core/help.ts:91](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L91)

## Resolve

• **ResolveCommandOptions**: `Object`

Options for the [`resolveCommand`](modules.md#resolvecommand) function.

#### Defined in

[core/resolve.ts:19](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L19)

• **ResolvedCommand**: `Object`

Object containing details about the resolved command, the path to the
command file, any parameters, and a function to resolve the next command, if
any.

#### Defined in

[core/resolve.ts:305](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L305)

### Params

Ƭ **Params**: `Record`\<`string`, `string` \| `string`[]\>

Params that were parsed from the command string.

#### Defined in

[core/resolve.ts:297](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L297)

___

### ResolveCommandFn

Ƭ **ResolveCommandFn**: (`options`: [`ResolveCommandOptions`](interfaces/ResolveCommandOptions.md)) => `MaybePromise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

#### Type declaration

▸ (`options`): `MaybePromise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

A function to resolve a command based on the provided command string and
directory path, returning the first matching command.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ResolveCommandOptions`](interfaces/ResolveCommandOptions.md) |

##### Returns

`MaybePromise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

#### Defined in

[core/resolve.ts:289](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L289)

___

### formatFileName

▸ **formatFileName**(`fileName`): `string`

Formats a file name to ensure it ends with `.js`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |

#### Returns

`string`

#### Defined in

[core/resolve.ts:345](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L345)

___

### prepareResolvedCommand

▸ **prepareResolvedCommand**(`resolved`, `parseFn`): `Promise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

Prepares a resolved command by ensuring the remaining command string starts
with a subcommand name, adding a `resolveNext` function if the command isn't
the last one, and replacing the handler with a pass-through function if the
command won't be executed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolved` | [`ResolvedCommand`](interfaces/ResolvedCommand.md) | The resolved command to prepare. |
| `parseFn` | [`ParseCommandFn`](modules.md#parsecommandfn) | The function to parse the command string. |

#### Returns

`Promise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

The prepared resolved command.

#### Defined in

[core/resolve.ts:232](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L232)

___

### resolveCommand

▸ **resolveCommand**(`«destructured»`): `Promise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

Resolves a command based on the provided command string and directory path,
returning the first matching command.

This function attempts to locate a matching command file for the provided
command string. If found, it imports and returns the associated command. If a
command file isn't directly found, it checks if the path is a directory and
treats it as a pass-through command, allowing deeper command resolution.

If neither a command file nor a directory is found, it checks for
parameterized command files (e.g., [param].ts or [...param].ts) in the
expected directory and tries to resolve them.

The function provides detailed error feedback if the command can't be
resolved or if the found module doesn't export a default command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ResolveCommandOptions`](interfaces/ResolveCommandOptions.md) |

#### Returns

`Promise`\<[`ResolvedCommand`](interfaces/ResolvedCommand.md)\>

Object containing details about the resolved command, the path to
the command file, any parameters, and a function to resolve the next command,
if any.

**`Throws`**

Throws an error if command resolution fails due to missing tokens, command
not found, or missing default export.

#### Defined in

[core/resolve.ts:59](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L59)

## Parse

### OptionValues

Ƭ **OptionValues**: `Record`\<`string`, [`OptionPrimitiveType`](modules.md#optionprimitivetype) \| `undefined`\>

The values for each option.

#### Defined in

[core/parse.ts:15](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/parse.ts#L15)

___

### ParseCommandFn

Ƭ **ParseCommandFn**: (`commandString`: `string`, `optionsConfig`: [`OptionsConfig`](modules.md#optionsconfig)) => `MaybePromise`\<[`ParsedCommand`](modules.md#parsedcommand)\>

#### Type declaration

▸ (`commandString`, `optionsConfig`): `MaybePromise`\<[`ParsedCommand`](modules.md#parsedcommand)\>

A function to parse a command string.

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandString` | `string` |
| `optionsConfig` | [`OptionsConfig`](modules.md#optionsconfig) |

##### Returns

`MaybePromise`\<[`ParsedCommand`](modules.md#parsedcommand)\>

#### Defined in

[core/parse.ts:30](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/parse.ts#L30)

___

### ParsedCommand

Ƭ **ParsedCommand**: `Object`

The result of parsing a command string.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `options` | [`OptionValues`](modules.md#optionvalues) |
| `tokens` | [`Tokens`](modules.md#tokens) |

#### Defined in

[core/parse.ts:21](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/parse.ts#L21)

___

### Tokens

Ƭ **Tokens**: `string`[]

Command tokens representing commands, subcommands, and/or params.

#### Defined in

[core/parse.ts:9](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/parse.ts#L9)

___

### parseCommand

▸ **parseCommand**(`commandString`, `optionsConfig`): [`ParsedCommand`](modules.md#parsedcommand)

Parse a command string into command tokens and options values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandString` | `string` | The command string to parse. |
| `optionsConfig` | [`OptionsConfig`](modules.md#optionsconfig) | The options config to use when parsing. Only options that are defined in the config will be included in the option values. Any options that are not defined in the config will be treated as command tokens. |

#### Returns

[`ParsedCommand`](modules.md#parsedcommand)

The parsed command tokens and options values.

#### Defined in

[core/parse.ts:46](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/parse.ts#L46)

## Options

• **OptionConfig**\<`T`, `TAlias`\>: `Object`

The configuration interface for an option used to define how an option will
be parsed and validated.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OptionType`](modules.md#optiontype) = [`OptionType`](modules.md#optiontype) |
| `TAlias` | extends `string` = `string` |

#### Defined in

[core/options/types.ts:15](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L15)

### OptionGetter

Ƭ **OptionGetter**\<`T`\>: (`getterOptions?`: `OptionGetterOptions`) => `Promise`\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`getterOptions?`): `Promise`\<`T`\>

A function to dynamically retrieve the value of a command option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `getterOptions?` | `OptionGetterOptions` |

##### Returns

`Promise`\<`T`\>

#### Defined in

[core/options/option-getter.ts:11](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/option-getter.ts#L11)

___

### OptionPrimitiveType

Ƭ **OptionPrimitiveType**\<`T`\>: `T` extends ``"string"`` ? `string` : `T` extends ``"number"`` ? `number` : `T` extends ``"boolean"`` ? `boolean` : `T` extends ``"array"`` ? `string`[] : `never`

Get the primitive type for an option type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OptionType`](modules.md#optiontype) = [`OptionType`](modules.md#optiontype) |

#### Defined in

[core/options/types.ts:63](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L63)

___

### OptionType

Ƭ **OptionType**: ``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"array"``

The possible types for an option.

#### Defined in

[core/options/types.ts:8](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L8)

___

### OptionsConfig

Ƭ **OptionsConfig**\<`TKey`, `TType`\>: `Record`\<`TKey`, [`OptionConfig`](interfaces/OptionConfig.md)\<`TType`, `TKey`\>\>

The options config for a command.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` = `string` |
| `TType` | extends [`OptionType`](modules.md#optiontype) = [`OptionType`](modules.md#optiontype) |

#### Defined in

[core/options/types.ts:54](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L54)

___

### OptionsGetter

Ƭ **OptionsGetter**\<`TOptions`\>: \{ [K in keyof TOptions as K \| Alias\<TOptions[K]\> \| CamelCase\<K \| Alias\<TOptions[K]\>\>]: OptionGetter\<CommandOptionType\<TOptions[K]\>\> } & \{ `values`: \{ [K in keyof TOptions as K \| Alias\<TOptions[K]\> \| CamelCase\<K \| Alias\<TOptions[K]\>\>]: CommandOptionType\<TOptions[K]\> } ; `get`: \<K\>(`optionNames`: `K`[]) => `Promise`\<\{ [O in string \| number \| symbol as O \| CamelCase\<O\>]: CommandOptionsTypes\<TOptions\>[O] }\>  }

An object that can be used to dynamically retrieve the values of command
options, including aliases. Options can be retrieved by their original key,
any of their aliases, or camelCased versions of either.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TOptions` | extends [`OptionsConfig`](modules.md#optionsconfig) = [`OptionsConfig`](modules.md#optionsconfig) |

#### Defined in

[core/options/options-getter.ts:155](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/options-getter.ts#L155)

___

### createOptionGetter

▸ **createOptionGetter**\<`TConfig`, `TValue`\>(`getOptions`): [`OptionGetter`](modules.md#optiongetter)\<`TValue`\>

Creates an `OptionGetter` function to dynamically retrieve the
value of a command option. The getter function accepts an optional
`OptionGetterOptions` object, which can be used to prompt the user when no value
is provided and/or validate the value.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TConfig` | extends [`OptionConfig`](interfaces/OptionConfig.md)\<[`OptionType`](modules.md#optiontype), `string`\> = [`OptionConfig`](interfaces/OptionConfig.md)\<[`OptionType`](modules.md#optiontype), `string`\> |
| `TValue` | `undefined` \| `MaybeReadonly`\<[`OptionPrimitiveType`](modules.md#optionprimitivetype)\<`TConfig`[``"type"``]\>\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `getOptions` | `OptionGetterFactoryOptions`\<`TConfig`, `TValue`\> | The options to create the getter. |

#### Returns

[`OptionGetter`](modules.md#optiongetter)\<`TValue`\>

The getter function for the provided option.

**`Example`**

```ts
const fooGetter = createOptionGetter({
  name: 'foo',
  option: {
    type: 'string',
    default: 'default foo',
  },
  value: 'foo value',
  client: new Client(),
});
const val = fooGetter({ prompt: { message: 'Enter foo' } }); // 'foo value'
```

**`Throws`**

Throws an error if the option is required and no value
is provided or the value is invalid.

#### Defined in

[core/options/option-getter.ts:63](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/option-getter.ts#L63)

___

### createOptionsGetter

▸ **createOptionsGetter**\<`TKey`, `TType`, `TOptionsConfig`, `TOptionValues`\>(`«destructured»`): [`OptionsGetter`](modules.md#optionsgetter)\<`TOptionsConfig`\>

Converts command options to a getter object.

This function transforms an `Options` object into a
`CommandOptionsGetter` object that has getter methods for each of the
options. The getters can then be used to retrieve the values of the options
dynamically. If an option has defined aliases, the returned getter will have
additional getter methods for each alias, all pointing to the original
option's value.

Additionally, the returned object has a `get` method, which accepts an array
of option keys and returns an object with the corresponding camelCased
key-value pairs.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` = `string` |
| `TType` | extends [`OptionType`](modules.md#optiontype) = [`OptionType`](modules.md#optiontype) |
| `TOptionsConfig` | extends [`OptionsConfig`](modules.md#optionsconfig)\<`TKey`, `TType`\> = [`OptionsConfig`](modules.md#optionsconfig)\<`TKey`, `TType`\> |
| `TOptionValues` | extends [`OptionValues`](modules.md#optionvalues) = [`OptionValues`](modules.md#optionvalues) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `CreateOptionsGetterOptions`\<`TOptionsConfig`, `TOptionValues`\> |

#### Returns

[`OptionsGetter`](modules.md#optionsgetter)\<`TOptionsConfig`\>

**`Example`**

```ts
const options = {
  f: {
    type: 'string',
    alias: ['foo'],
    default: 'default foo'
  },
};
const optionsGetter = createOptionsGetter({
  options,
  originalGetter: optionsGetter({}),
  client: new Client(),
});
const val = optionsGetter.foo(); // 'default foo'
```

#### Defined in

[core/options/options-getter.ts:61](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/options-getter.ts#L61)

___

### removeOptionTokens

▸ **removeOptionTokens**(`commandString`, `options`): `string`

Removes option tokens from a command string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandString` | `string` | The command string to remove the tokens from. |
| `options` | [`OptionValues`](modules.md#optionvalues) | The option values to remove the tokens for. |

#### Returns

`string`

The command string with the option tokens removed.

#### Defined in

[core/options/remove-option-tokens.ts:10](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/remove-option-tokens.ts#L10)

___

### validateOptionType

▸ **validateOptionType**(`value`, `name`, `type`): `void`

Validates an option value based on its type and throws an error if the
value is invalid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | The option value to validate. |
| `name` | `string` | The name of the option. |
| `type` | [`OptionType`](modules.md#optiontype) | The expected type of the option. |

#### Returns

`void`

**`Throws`**

Throws an error if the option value is invalid.

#### Defined in

[core/options/validate-options.ts:82](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/validate-options.ts#L82)

___

### validateOptions

▸ **validateOptions**(`options`, `config`): `void`

Validates the options for a command by checking for required options,
conflicts, and dependencies.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`OptionValues`](modules.md#optionvalues) | - |
| `config` | [`OptionsConfig`](modules.md#optionsconfig) | The option config to be validated. |

#### Returns

`void`

**`Throws`**

Throws an error if the options are invalid.

#### Defined in

[core/options/validate-options.ts:12](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/validate-options.ts#L12)

___

### validateOptionsConfig

▸ **validateOptionsConfig**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`OptionsConfig`](modules.md#optionsconfig) |

#### Returns

`void`

**`Throws`**

Throws an error if the options config is invalid.

#### Defined in

[core/options/validate-option-config.ts:8](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/validate-option-config.ts#L8)

## Plugins

### help

• `Const` **help**: [`Plugin`](interfaces/Plugin.md)

A Clide-JS plugin that prints help information on execution if the `-h` or
`--help` flags are present or when a usage error occurs and skips actual
execution.

If there's a usage error, and the help flag is not present, the usage error
will also be printed and set as the command's result.

#### Defined in

[plugins/help.ts:16](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/plugins/help.ts#L16)

___

### logger

• `Const` **logger**: [`Plugin`](interfaces/Plugin.md)

A minimal logger plugin that logs the result of each execution step.

#### Defined in

[plugins/logger.ts:8](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/plugins/logger.ts#L8)

## Utils

### CamelCase

Ƭ **CamelCase**\<`S`\>: `S` extends \`$\{infer T}-$\{infer U}\` ? \`$\{Lowercase\<T\>}$\{Capitalize\<CamelCase\<U\>\>}\` : `S`

#### Type parameters

| Name |
| :------ |
| `S` |

#### Defined in

[utils/camel-case.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/camel-case.ts#L20)

___

### camelCase

▸ **camelCase**\<`S`\>(`str`): [`CamelCase`](modules.md#camelcase)\<`S`\>

Converts a hyphenated string to camel case.

#### Type parameters

| Name |
| :------ |
| `S` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `S` |

#### Returns

[`CamelCase`](modules.md#camelcase)\<`S`\>

**`Example`**

```ts
camelCase('foo-bar') // 'fooBar'
```

#### Defined in

[utils/camel-case.ts:9](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/camel-case.ts#L9)

___

### findSimilar

▸ **findSimilar**(`input`, `choices`, `options?`): `string`[]

Returns strings from `choices` that are similar to `input` using the
Levenshtein distance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | The input string to compare against. |
| `choices` | `string`[] | The choices to find similar strings from. |
| `options` | `FindSimilarOptions` | Additional options. |

#### Returns

`string`[]

Up to `options.maxResults` strings from `choices` that are similar
to `input`.

#### Defined in

[utils/find-similar.ts:29](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/find-similar.ts#L29)

___

### getBin

▸ **getBin**(): `string`

Get the binary name from argv

#### Returns

`string`

#### Defined in

[utils/argv.ts:5](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/argv.ts#L5)

___

### getCallerPath

▸ **getCallerPath**(): `string` \| `undefined`

Attempts to get the path to the file that called the function that called
this function.

#### Returns

`string` \| `undefined`

**`Example`**

#### Caller:
```ts
// /path/to/file.ts
import { foo } from './path/to/foo.ts';

foo();
```

#### Callee:

```ts
// /path/to/foo.ts
import { getCallerPath } from 'src/utils/get-caller';

export function foo() {
 console.log(getCallerPath()); // /path/to/file.ts
}
```

#### Defined in

[utils/caller-path.ts:27](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/caller-path.ts#L27)

___

### hideBin

▸ **hideBin**(`argv`): `string`[]

Get the argv without the binary name

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

`string`[]

#### Defined in

[utils/argv.ts:13](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/argv.ts#L13)

___

### isDirectory

▸ **isDirectory**(`path`): `boolean`

Determine if a path is a directory without throwing an error

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/fs.ts:7](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/fs.ts#L7)

___

### isModuleNotFoundError

▸ **isModuleNotFoundError**(`err`): `boolean`

Determine if an error is a module not found error

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `unknown` |

#### Returns

`boolean`

#### Defined in

[utils/fs.ts:19](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/fs.ts#L19)

___

### parseFileName

▸ **parseFileName**(`fileName`): `Object`

Parses a file name to determine if it's a parameterized command file.

Parameterized command files are named using the following format:
  - `[param]` - A single parameter with no file extension
  - `[param].ts` - A single parameter
  - `[...param].ts` - A spread operator parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | The file name to parse. |

#### Returns

`Object`

Object containing the spread operator, parameter name, and file
extension, if any.

| Name | Type |
| :------ | :------ |
| `extension` | `string` \| `undefined` |
| `paramName` | `string` \| `undefined` |
| `spreadOperator` | `string` \| `undefined` |

**`Example`**

```ts
// A single parameter with no file extension
parseFileName('[foo]');
// => {
//   spreadOperator: undefined,
//   paramName: 'foo',
//   extension: undefined,
// }

// A single parameter
parseFileName('[foo].ts');
// => {
//   spreadOperator: undefined,
//   paramName: 'foo',
//   extension: '.ts',
// }

// A spread operator parameter
parseFileName('[...foo].ts');
// => {
//   spreadOperator: '...',
//   paramName: 'foo',
//   extension: '.ts',
// }

// Not a parameterized command file
parseFileName('foo.ts');
// => {
//   spreadOperator: undefined,
//   paramName: undefined,
//   extension: undefined,
// }
```

#### Defined in

[utils/parse-file-name.ts:52](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/parse-file-name.ts#L52)

___

### removeFileExtension

▸ **removeFileExtension**(`str`): `string`

Removes the file extension from a string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

**`Example`**

```ts
removeFileExtension('foo.txt') // 'foo'
```

#### Defined in

[utils/remove-file-extension.ts:9](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/utils/remove-file-extension.ts#L9)
