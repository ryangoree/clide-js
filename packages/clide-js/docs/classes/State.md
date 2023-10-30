[clide-js](../README.md) / [Exports](../modules.md) / State

# Class: State\<TData, TOptions\>

Execution state management.

The `State` is responsible for managing the state of command execution.
It provides mechanisms to progress through command execution, handle state
transitions, and manage the lifecycle of command data.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `unknown` |
| `TOptions` | extends [`OptionsConfig`](../modules.md#optionsconfig) = [`OptionsConfig`](../modules.md#optionsconfig) |

## Table of contents

### Accessors

- [command](State.md#command)
- [commands](State.md#commands)
- [context](State.md#context)
- [data](State.md#data)
- [i](State.md#i)
- [isDone](State.md#isdone)
- [options](State.md#options)
- [params](State.md#params)

### Constructors

- [constructor](State.md#constructor)

### Methods

- [end](State.md#end)
- [next](State.md#next)
- [start](State.md#start)

## Accessors

### command

• `get` **command**(): [`ResolvedCommand`](../interfaces/ResolvedCommand.md)

The current command.

#### Returns

[`ResolvedCommand`](../interfaces/ResolvedCommand.md)

#### Defined in

[core/state.ts:62](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L62)

___

### commands

• `get` **commands**(): [`ResolvedCommand`](../interfaces/ResolvedCommand.md)[]

The commands that will be executed.

#### Returns

[`ResolvedCommand`](../interfaces/ResolvedCommand.md)[]

#### Defined in

[core/state.ts:66](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L66)

___

### context

• `get` **context**(): [`Context`](Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\>

The context for the command.

#### Returns

[`Context`](Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\>

#### Defined in

[core/state.ts:74](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L74)

___

### data

• `get` **data**(): `TData`

The current data.

#### Returns

`TData`

#### Defined in

[core/state.ts:78](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L78)

___

### i

• `get` **i**(): `number`

The current step index.

#### Returns

`number`

#### Defined in

[core/state.ts:58](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L58)

___

### isDone

• `get` **isDone**(): `boolean`

Whether the steps are done.

#### Returns

`boolean`

#### Defined in

[core/state.ts:70](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L70)

___

### options

• `get` **options**(): [`OptionsGetter`](../modules.md#optionsgetter)\<`TOptions`\>

An `OptionsGetter` to dynamically retrieve options.

#### Returns

[`OptionsGetter`](../modules.md#optionsgetter)\<`TOptions`\>

#### Defined in

[core/state.ts:86](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L86)

___

### params

• `get` **params**(): [`Params`](../modules.md#params)

The current params, including params from previous steps.

#### Returns

[`Params`](../modules.md#params)

#### Defined in

[core/state.ts:82](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L82)

## Constructors

### constructor

• **new State**\<`TData`, `TOptions`\>(`«destructured»`): [`State`](State.md)\<`TData`, `TOptions`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `unknown` |
| `TOptions` | extends [`OptionsConfig`](../modules.md#optionsconfig) = [`OptionsConfig`](../modules.md#optionsconfig) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `StateOptions`\<`TData`\> |

#### Returns

[`State`](State.md)\<`TData`, `TOptions`\>

#### Defined in

[core/state.ts:44](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L44)

## Methods

### end

▸ **end**(`data?`): `Promise`\<`void`\>

Return data and end the steps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | The data to return. |

#### Returns

`Promise`\<`void`\>

**`Throws`**

If an error is provided and the step is not the last.

#### Defined in

[core/state.ts:171](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L171)

___

### next

▸ **next**(`data?`): `Promise`\<`void`\>

Modify the data and continue to the next step if there is one, otherwise
return the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | The data to pass to the next step or return. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/state.ts:122](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L122)

___

### start

▸ **start**(`initialData?`): `Promise`\<`void`\>

Start the steps.

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialData?` | `unknown` |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the steps are done.

**`Throws`**

If the steps have already started.

#### Defined in

[core/state.ts:95](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/state.ts#L95)
