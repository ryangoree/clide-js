[clide-js](../README.md) / [Exports](../modules.md) / OptionConfig

# Interface: OptionConfig\<T, TAlias\>

The configuration interface for an option used to define how an option will
be parsed and validated.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OptionType`](../modules.md#optiontype) = [`OptionType`](../modules.md#optiontype) |
| `TAlias` | extends `string` = `string` |

## Table of contents

### Properties

- [alias](OptionConfig.md#alias)
- [conflicts](OptionConfig.md#conflicts)
- [default](OptionConfig.md#default)
- [description](OptionConfig.md#description)
- [nargs](OptionConfig.md#nargs)
- [prompt](OptionConfig.md#prompt)
- [required](OptionConfig.md#required)
- [requires](OptionConfig.md#requires)
- [type](OptionConfig.md#type)

## Properties

### alias

• `Optional` **alias**: `MaybeReadonly`\<`TAlias`[]\>

One or more aliases for the option (optional).

#### Defined in

[core/options/types.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L20)

___

### conflicts

• `Optional` **conflicts**: `MaybeReadonly`\<`string`[]\>

Other options that are mutually exclusive with this option (optional).

#### Defined in

[core/options/types.ts:40](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L40)

___

### default

• `Optional` **default**: `MaybeReadonly`\<[`OptionPrimitiveType`](../modules.md#optionprimitivetype)\<`T`\>\>

The default value to use the prompt will show (optional).

#### Defined in

[core/options/types.ts:30](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L30)

___

### description

• `Optional` **description**: `string`

The description of the option (optional, has default based on `name`).

#### Defined in

[core/options/types.ts:26](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L26)

___

### nargs

• `Optional` **nargs**: `number`

The number of arguments the option accepts (optional).

#### Defined in

[core/options/types.ts:24](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L24)

___

### prompt

• `Optional` **prompt**: `string` \| [`PromptOptions`](../modules.md#promptoptions)

The prompt to show the user if no value is provided (optional).

#### Defined in

[core/options/types.ts:28](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L28)

___

### required

• `Optional` **required**: `boolean`

Prompts the user for the option if it's not present and requires the
user enters a valid value. If no `prompt` field is provided, a default
will be used based on `name`.

#### Defined in

[core/options/types.ts:36](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L36)

___

### requires

• `Optional` **requires**: `MaybeReadonly`\<`string`[]\>

Other options that are required for this option to be used (optional).

#### Defined in

[core/options/types.ts:38](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L38)

___

### type

• **type**: `T`

The type of the option (optional, has default based on `default`).

#### Defined in

[core/options/types.ts:22](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/options/types.ts#L22)
