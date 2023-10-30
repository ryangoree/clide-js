[clide-js](../README.md) / [Exports](../modules.md) / NotFoundError

# Class: NotFoundError

An error indicating a command is not found.

## Hierarchy

- [`UsageError`](UsageError.md)

  ↳ **`NotFoundError`**

## Table of contents

### Accessors

- [name](NotFoundError.md#name)

### Constructors

- [constructor](NotFoundError.md#constructor)

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

• **new NotFoundError**(`token`, `path`): [`NotFoundError`](NotFoundError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` \| `number` |
| `path` | `string` |

#### Returns

[`NotFoundError`](NotFoundError.md)

#### Overrides

[UsageError](UsageError.md).[constructor](UsageError.md#constructor)

#### Defined in

[core/errors.ts:77](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L77)
