[clide-js](../README.md) / [Exports](../modules.md) / RequiredSubcommandError

# Class: RequiredSubcommandError

An error indicating a required subcommand is missing.

## Hierarchy

- [`UsageError`](UsageError.md)

  ↳ **`RequiredSubcommandError`**

## Table of contents

### Accessors

- [name](RequiredSubcommandError.md#name)

### Constructors

- [constructor](RequiredSubcommandError.md#constructor)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

UsageError.name

#### Defined in

[core/errors.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L20)

• `set` **name**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`void`

#### Inherited from

UsageError.name

#### Defined in

[core/errors.ts:23](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L23)

## Constructors

### constructor

• **new RequiredSubcommandError**(`commandString`): [`RequiredSubcommandError`](RequiredSubcommandError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandString` | `string` |

#### Returns

[`RequiredSubcommandError`](RequiredSubcommandError.md)

#### Overrides

[UsageError](UsageError.md).[constructor](UsageError.md#constructor)

#### Defined in

[core/errors.ts:107](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L107)
