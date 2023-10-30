[clide-js](../README.md) / [Exports](../modules.md) / PluginInfo

# Interface: PluginInfo

Metadata about a plugin.

**`Catgory`**

Core

## Hierarchy

- **`PluginInfo`**

  ↳ [`Plugin`](Plugin.md)

## Table of contents

### Properties

- [description](PluginInfo.md#description)
- [meta](PluginInfo.md#meta)
- [name](PluginInfo.md#name)
- [version](PluginInfo.md#version)

## Properties

### description

• `Optional` **description**: `string`

A description of the plugin.

#### Defined in

[core/plugin.ts:15](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L15)

___

### meta

• `Optional` **meta**: `Object`

Any additional metadata about the plugin. This is useful for plugins that
need to provide additional data to other plugins or commands.

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[core/plugin.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L20)

___

### name

• **name**: `string`

The name of the plugin.

#### Defined in

[core/plugin.ts:11](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L11)

___

### version

• **version**: `string`

The version of the plugin.

#### Defined in

[core/plugin.ts:13](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L13)
