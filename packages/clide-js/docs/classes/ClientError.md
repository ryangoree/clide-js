[clide-js](../README.md) / [Exports](../modules.md) / ClientError

# Class: ClientError

An error that has already been printed by the client.

## Hierarchy

- [`ClideError`](ClideError.md)

  ↳ **`ClientError`**

## Table of contents

### Accessors

- [name](ClientError.md#name)

### Constructors

- [constructor](ClientError.md#constructor)

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

• **new ClientError**(`message`): [`ClientError`](ClientError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`ClientError`](ClientError.md)

#### Overrides

[ClideError](ClideError.md).[constructor](ClideError.md#constructor)

#### Defined in

[core/errors.ts:33](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L33)
