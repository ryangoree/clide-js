[clide-js](../README.md) / [Exports](../modules.md) / Client

# Class: Client

A client that can be used to log messages, errors, and prompt the user.

This is a **WIP** and will be built out more in the future. For now, it's
just a simple wrapper around `console` and
[prompts](https://github.com/terkelg/prompts).

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Methods

- [error](Client.md#error)
- [log](Client.md#log)
- [prompt](Client.md#prompt)
- [warn](Client.md#warn)

## Constructors

### constructor

• **new Client**(): [`Client`](Client.md)

#### Returns

[`Client`](Client.md)

## Methods

### error

▸ **error**(`error`): [`ClientError`](ClientError.md)

Log an error message to stderr.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `any` | The error to log. |

#### Returns

[`ClientError`](ClientError.md)

The error wrapped in a [`ClientError`](ClientError.md).

#### Defined in

[core/client.ts:45](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L45)

___

### log

▸ **log**(`...message`): `void`

Log a message to stdout.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...message` | `any` | Any number of arguments to log. |

#### Returns

`void`

#### Defined in

[core/client.ts:36](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L36)

___

### prompt

▸ **prompt**(`prompt`): `Promise`\<`any`\>

Prompt the user for input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | [`PromptOptions`](../modules.md#promptoptions) | The prompt options. |

#### Returns

`Promise`\<`any`\>

The user's input.

**`See`**

https://github.com/terkelg/prompts#-prompt-objects

#### Defined in

[core/client.ts:72](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L72)

___

### warn

▸ **warn**(`...warning`): `void`

Log a warning message to stdout.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...warning` | `any` | Any number of arguments to log. |

#### Returns

`void`

#### Defined in

[core/client.ts:61](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/client.ts#L61)
