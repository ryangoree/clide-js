[clide-js](../README.md) / [Exports](../modules.md) / ResolveCommandOptions

# Interface: ResolveCommandOptions

Options for the [`resolveCommand`](../modules.md#resolvecommand) function.

## Table of contents

### Properties

- [commandString](ResolveCommandOptions.md#commandstring)
- [commandsDir](ResolveCommandOptions.md#commandsdir)
- [parseFn](ResolveCommandOptions.md#parsefn)

## Properties

### commandString

• **commandString**: `string`

The command string to resolve a command file for.

#### Defined in

[core/resolve.ts:21](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L21)

___

### commandsDir

• **commandsDir**: `string`

The path to the directory containing the command files.

#### Defined in

[core/resolve.ts:23](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L23)

___

### parseFn

• `Optional` **parseFn**: [`ParseCommandFn`](../modules.md#parsecommandfn)

A function to parse the command string and options. Used to determine if
the command string contains any options and to remove them from the
remaining command string.

#### Defined in

[core/resolve.ts:29](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/resolve.ts#L29)
