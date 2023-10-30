[clide-js](../README.md) / [Exports](../modules.md) / OptionsError

# Class: OptionsError

An error indicating the user has provided invalid options.

## Hierarchy

- [`UsageError`](UsageError.md)

  ↳ **`OptionsError`**

## Table of contents

### Accessors

- [name](OptionsError.md#name)

### Constructors

- [constructor](OptionsError.md#constructor)

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

• **new OptionsError**(`message`): [`OptionsError`](OptionsError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`OptionsError`](OptionsError.md)

#### Overrides

[UsageError](UsageError.md).[constructor](UsageError.md#constructor)

#### Defined in

[core/errors.ts:55](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L55)
