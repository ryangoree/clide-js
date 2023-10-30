[clide-js](../README.md) / [Exports](../modules.md) / HooksEmitter

# Class: HooksEmitter

A class for registering, un-registering, and calling hooks. The hooks called
by the CLI engine are defined in the [`Hooks`](../interfaces/Hooks.md) type, but any string
can be used as a hook name, allowing plugins to define their own hooks.

**`Remarks`**

Each registered hook handler is awaited in series to ensure that hooks are
called in the order they were registered.

## Table of contents

### Constructors

- [constructor](HooksEmitter.md#constructor)

### Methods

- [call](HooksEmitter.md#call)
- [off](HooksEmitter.md#off)
- [on](HooksEmitter.md#on)
- [once](HooksEmitter.md#once)

## Constructors

### constructor

• **new HooksEmitter**(): [`HooksEmitter`](HooksEmitter.md)

#### Returns

[`HooksEmitter`](HooksEmitter.md)

## Methods

### call

▸ **call**\<`THook`\>(`hook`, `...args`): `Promise`\<`void`\>

Call a hook with the given arguments.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends keyof [`Hooks`](../interfaces/Hooks.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hook` | `THook` | The hook to call. |
| `...args` | `Parameters`\<[`Hooks`](../interfaces/Hooks.md)[`THook`]\> | The arguments to pass to the hook handlers. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/hooks.ts:329](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L329)

▸ **call**\<`THook`\>(`hook`, `...args`): `Promise`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends `string` = keyof [`Hooks`](../interfaces/Hooks.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `THook` |
| `...args` | `THook` extends keyof [`Hooks`](../interfaces/Hooks.md) ? `Parameters`\<[`Hooks`](../interfaces/Hooks.md)[`THook`]\> : `any`[] |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/hooks.ts:333](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L333)

___

### off

▸ **off**\<`THook`\>(`hook`, `fn`): `boolean`

Un-register a hook handler for a given hook.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends keyof [`Hooks`](../interfaces/Hooks.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hook` | `THook` | The hook to un-register the handler for. |
| `fn` | [`Hooks`](../interfaces/Hooks.md)[`THook`] | The function to un-register. |

#### Returns

`boolean`

Whether or not the handler was un-registered.

#### Defined in

[core/hooks.ts:284](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L284)

▸ **off**\<`THook`\>(`hook`, `fn`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `string` |
| `fn` | `THook` extends keyof [`Hooks`](../interfaces/Hooks.md) ? [`Hooks`](../interfaces/Hooks.md)[`THook`] : (...`args`: `any`) => `any` |

#### Returns

`boolean`

#### Defined in

[core/hooks.ts:285](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L285)

___

### on

▸ **on**\<`THook`\>(`hook`, `fn`): `void`

Register a new hook handler for a given hook.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends keyof [`Hooks`](../interfaces/Hooks.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hook` | `THook` | The hook to register the handler for. |
| `fn` | [`Hooks`](../interfaces/Hooks.md)[`THook`] | The function to call when the hook is called. |

#### Returns

`void`

#### Defined in

[core/hooks.ts:262](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L262)

▸ **on**\<`THook`\>(`hook`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `string` |
| `fn` | `THook` extends keyof [`Hooks`](../interfaces/Hooks.md) ? [`Hooks`](../interfaces/Hooks.md)[`THook`] : (...`args`: `any`) => `any` |

#### Returns

`void`

#### Defined in

[core/hooks.ts:263](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L263)

___

### once

▸ **once**\<`THook`\>(`hook`, `fn`): `void`

Register a new hook handler for a given hook that will only be called once,
then un-registered.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends keyof [`Hooks`](../interfaces/Hooks.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hook` | `THook` | The hook to register the handler for. |
| `fn` | [`Hooks`](../interfaces/Hooks.md)[`THook`] | The function to call when the hook is called. |

#### Returns

`void`

#### Defined in

[core/hooks.ts:311](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L311)

▸ **once**\<`THook`\>(`hook`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THook` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `string` |
| `fn` | `THook` extends keyof [`Hooks`](../interfaces/Hooks.md) ? [`Hooks`](../interfaces/Hooks.md)[`THook`] : (...`args`: `any`) => `any` |

#### Returns

`void`

#### Defined in

[core/hooks.ts:312](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L312)
