[clide-js](../README.md) / [Exports](../modules.md) / ClideError

# Class: ClideError

An error thrown by the CLI engine.

## Hierarchy

- `Error`

  ↳ **`ClideError`**

  ↳↳ [`ClientError`](ClientError.md)

  ↳↳ [`UsageError`](UsageError.md)

  ↳↳ [`OptionsConfigError`](OptionsConfigError.md)

  ↳↳ [`MissingDefaultExportError`](MissingDefaultExportError.md)

## Table of contents

### Accessors

- [name](ClideError.md#name)

### Constructors

- [constructor](ClideError.md#constructor)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Overrides

Error.name

#### Defined in

[core/errors.ts:20](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L20)

• `set` **name**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`void`

#### Overrides

Error.name

#### Defined in

[core/errors.ts:23](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L23)

## Constructors

### constructor

• **new ClideError**(`error`): [`ClideError`](ClideError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

[`ClideError`](ClideError.md)

#### Overrides

Error.constructor

#### Defined in

[core/errors.ts:14](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/errors.ts#L14)
