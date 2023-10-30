[clide-js](../README.md) / [Exports](../modules.md) / UsageError

# Class: UsageError

An error indicating the user has done something wrong.

## Hierarchy

- [`ClideError`](ClideError.md)

  ↳ **`UsageError`**

  ↳↳ [`OptionsError`](OptionsError.md)

  ↳↳ [`NotFoundError`](NotFoundError.md)

  ↳↳ [`RequiredSubcommandError`](RequiredSubcommandError.md)

## Table of contents

### Accessors

- [name](UsageError.md#name)

### Constructors

- [constructor](UsageError.md#constructor)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

ClideError.name

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

ClideError.name

#### Defined in

[core/errors.ts:23](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L23)

## Constructors

### constructor

• **new UsageError**(`error`): [`UsageError`](UsageError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

[`UsageError`](UsageError.md)

#### Overrides

[ClideError](ClideError.md).[constructor](ClideError.md#constructor)

#### Defined in

[core/errors.ts:44](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L44)
