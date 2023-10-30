[clide-js](../README.md) / [Exports](../modules.md) / MissingDefaultExportError

# Class: MissingDefaultExportError

An error indicating a command is missing a default export.

## Hierarchy

- [`ClideError`](ClideError.md)

  ↳ **`MissingDefaultExportError`**

## Table of contents

### Accessors

- [name](MissingDefaultExportError.md#name)

### Constructors

- [constructor](MissingDefaultExportError.md#constructor)

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

• **new MissingDefaultExportError**(`token`, `path`): [`MissingDefaultExportError`](MissingDefaultExportError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` \| `number` |
| `path` | `string` |

#### Returns

[`MissingDefaultExportError`](MissingDefaultExportError.md)

#### Overrides

[ClideError](ClideError.md).[constructor](ClideError.md#constructor)

#### Defined in

[core/errors.ts:96](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L96)
