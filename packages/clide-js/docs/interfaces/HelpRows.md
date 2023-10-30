[clide-js](../README.md) / [Exports](../modules.md) / HelpRows

# Interface: HelpRows

The rows that make up the help information for a command. In order of
appearance, the rows are:
- description
- usage
- optionsTitle
- options
- subcommandsTitle
- subcommands

## Table of contents

### Properties

- [description](HelpRows.md#description)
- [options](HelpRows.md#options)
- [optionsTitle](HelpRows.md#optionstitle)
- [subcommands](HelpRows.md#subcommands)
- [subcommandsTitle](HelpRows.md#subcommandstitle)
- [usage](HelpRows.md#usage)

## Properties

### description

• `Optional` **description**: `Column`

The command module's description.

#### Defined in

[core/help.ts:36](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L36)

___

### options

• `Optional` **options**: [`Column`, `Column`][]

A 2 column list of the available options and their descriptions.

#### Defined in

[core/help.ts:48](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L48)

___

### optionsTitle

• `Optional` **optionsTitle**: `Column`

The title for the options section.

#### Defined in

[core/help.ts:44](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L44)

___

### subcommands

• `Optional` **subcommands**: [`Column`, `Column`][]

A 2 column list of the available subcommands and their descriptions.

#### Defined in

[core/help.ts:56](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L56)

___

### subcommandsTitle

• `Optional` **subcommandsTitle**: `Column`

The title for the subcommands section.

#### Defined in

[core/help.ts:52](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L52)

___

### usage

• **usage**: `Column`

A dynamic usage string based on the resolved commands and their parameters.

#### Defined in

[core/help.ts:40](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/help.ts#L40)
