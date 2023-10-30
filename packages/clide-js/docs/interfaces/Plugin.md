[clide-js](../README.md) / [Exports](../modules.md) / Plugin

# Interface: Plugin

A Clide-JS plugin

## Hierarchy

- [`PluginInfo`](PluginInfo.md)

  ↳ **`Plugin`**

## Table of contents

### Properties

- [description](Plugin.md#description)
- [init](Plugin.md#init)
- [meta](Plugin.md#meta)
- [name](Plugin.md#name)
- [version](Plugin.md#version)

## Properties

### description

• `Optional` **description**: `string`

A description of the plugin.

#### Inherited from

[PluginInfo](PluginInfo.md).[description](PluginInfo.md#description)

#### Defined in

[core/plugin.ts:15](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L15)

___

### init

• **init**: (`context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\>) => `MaybePromise`\<`boolean`\>

#### Type declaration

▸ (`context`): `MaybePromise`\<`boolean`\>

Initialize the plugin.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The context the plugin is being initialized in. |

##### Returns

`MaybePromise`\<`boolean`\>

A boolean or promise that resolves to a boolean indicating
whether the plugin was successfully initialized.

#### Defined in

[core/plugin.ts:36](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L36)

___

### meta

• `Optional` **meta**: `Object`

Any additional metadata about the plugin. This is useful for plugins that
need to provide additional data to other plugins or commands.

#### Index signature

▪ [key: `string`]: `any`

#### Inherited from

[PluginInfo](PluginInfo.md).[meta](PluginInfo.md#meta)

#### Defined in

[core/plugin.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L20)

___

### name

• **name**: `string`

The name of the plugin.

#### Inherited from

[PluginInfo](PluginInfo.md).[name](PluginInfo.md#name)

#### Defined in

[core/plugin.ts:11](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L11)

___

### version

• **version**: `string`

The version of the plugin.

#### Inherited from

[PluginInfo](PluginInfo.md).[version](PluginInfo.md#version)

#### Defined in

[core/plugin.ts:13](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/plugin.ts#L13)
