[clide-js](../README.md) / [Exports](../modules.md) / ContextOptions

# Interface: ContextOptions\<TOptions\>

Options for creating a new [`Context`](../classes/Context.md) instance.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TOptions` | extends [`OptionsConfig`](../modules.md#optionsconfig) = [`OptionsConfig`](../modules.md#optionsconfig) |

## Table of contents

### Properties

- [client](ContextOptions.md#client)
- [commandString](ContextOptions.md#commandstring)
- [commandsDir](ContextOptions.md#commandsdir)
- [hooks](ContextOptions.md#hooks)
- [options](ContextOptions.md#options)
- [parseFn](ContextOptions.md#parsefn)
- [plugins](ContextOptions.md#plugins)
- [resolveFn](ContextOptions.md#resolvefn)

## Properties

### client

• `Optional` **client**: [`Client`](../classes/Client.md)

The standard streams client

#### Defined in

[core/context.ts:22](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L22)

___

### commandString

• **commandString**: `string`

The command string to be executed

#### Defined in

[core/context.ts:18](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L18)

___

### commandsDir

• **commandsDir**: `string`

The path to the directory containing command modules

#### Defined in

[core/context.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L20)

___

### hooks

• `Optional` **hooks**: [`HooksEmitter`](../classes/HooksEmitter.md)

The hooks emitter

#### Defined in

[core/context.ts:24](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L24)

___

### options

• `Optional` **options**: `TOptions`

The options config for the command

#### Defined in

[core/context.ts:28](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L28)

___

### parseFn

• `Optional` **parseFn**: [`ParseCommandFn`](../modules.md#parsecommandfn)

An optional function to replace the default command parser

#### Defined in

[core/context.ts:32](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L32)

___

### plugins

• `Optional` **plugins**: [`Plugin`](Plugin.md)[]

A list of plugins to load

#### Defined in

[core/context.ts:26](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L26)

___

### resolveFn

• `Optional` **resolveFn**: [`ResolveCommandFn`](../modules.md#resolvecommandfn)

An optional function to replace the default command resolver

#### Defined in

[core/context.ts:30](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L30)
