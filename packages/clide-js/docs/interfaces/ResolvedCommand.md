[clide-js](../README.md) / [Exports](../modules.md) / ResolvedCommand

# Interface: ResolvedCommand

Object containing details about the resolved command, the path to the
command file, any parameters, and a function to resolve the next command, if
any.

## Table of contents

### Properties

- [command](ResolvedCommand.md#command)
- [commandName](ResolvedCommand.md#commandname)
- [commandPath](ResolvedCommand.md#commandpath)
- [commandTokens](ResolvedCommand.md#commandtokens)
- [params](ResolvedCommand.md#params)
- [remainingCommandString](ResolvedCommand.md#remainingcommandstring)
- [resolveNext](ResolvedCommand.md#resolvenext)
- [subcommandsDir](ResolvedCommand.md#subcommandsdir)

## Properties

### command

• **command**: [`CommandModule`](../modules.md#commandmodule)

The command object associated with the resolved command.

#### Defined in

[core/resolve.ts:309](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L309)

___

### commandName

• **commandName**: `string`

The name of the resolved command.

#### Defined in

[core/resolve.ts:317](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L317)

___

### commandPath

• **commandPath**: `string`

The path to the resolved command file.

#### Defined in

[core/resolve.ts:313](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L313)

___

### commandTokens

• **commandTokens**: `string`[]

The command tokens that were resolved.

#### Defined in

[core/resolve.ts:321](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L321)

___

### params

• `Optional` **params**: [`Params`](../modules.md#params)

The params associated with the resolved command.

#### Defined in

[core/resolve.ts:338](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L338)

___

### remainingCommandString

• **remainingCommandString**: `string`

The part of the command string that has not yet been resolved.

#### Defined in

[core/resolve.ts:325](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L325)

___

### resolveNext

• `Optional` **resolveNext**: () => `Promise`\<[`ResolvedCommand`](ResolvedCommand.md)\>

#### Type declaration

▸ (): `Promise`\<[`ResolvedCommand`](ResolvedCommand.md)\>

A function to resolve the next command, if any, based on the remaining
command string.

##### Returns

`Promise`\<[`ResolvedCommand`](ResolvedCommand.md)\>

#### Defined in

[core/resolve.ts:334](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L334)

___

### subcommandsDir

• **subcommandsDir**: `string`

The path to the directory where the command's subcommands should live.

#### Defined in

[core/resolve.ts:329](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L329)
