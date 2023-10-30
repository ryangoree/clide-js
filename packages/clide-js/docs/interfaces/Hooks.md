[clide-js](../README.md) / [Exports](../modules.md) / Hooks

# Interface: Hooks

The hooks that can be used to customize the CLI engine.

## Table of contents

### Properties

- [error](Hooks.md#error)
- [postExecute](Hooks.md#postexecute)
- [postParse](Hooks.md#postparse)
- [postResolve](Hooks.md#postresolve)
- [postStateChange](Hooks.md#poststatechange)
- [preEnd](Hooks.md#preend)
- [preExecute](Hooks.md#preexecute)
- [preNext](Hooks.md#prenext)
- [preParse](Hooks.md#preparse)
- [preResolve](Hooks.md#preresolve)
- [preResolveNext](Hooks.md#preresolvenext)
- [preStateChange](Hooks.md#prestatechange)

## Properties

### error

• **error**: (`payload`: \{ `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `error`: `unknown` ; `ignore`: () => `void` ; `setError`: (`error`: `unknown`) => `void`  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.error` | `unknown` | The error that was thrown. |
| `payload.ignore` | () => `void` | Prevent the error from being thrown. |
| `payload.setError` | (`error`: `unknown`) => `void` | Override the error that will be thrown. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:215](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L215)

___

### postExecute

• **postExecute**: (`payload`: \{ `result`: `unknown` ; `setResult`: (`result`: `unknown`) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.result` | `unknown` | The final result. |
| `payload.setResult` | (`result`: `unknown`) => `void` | Override the final result. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:149](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L149)

___

### postParse

• **postParse**: (`payload`: \{ `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `parsedOptions`: [`OptionValues`](../modules.md#optionvalues) ; `setParsedOptions`: (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void`  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.parsedOptions` | [`OptionValues`](../modules.md#optionvalues) | The resulting parsed options. |
| `payload.setParsedOptions` | (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void` | Override the parsed options. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:119](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L119)

___

### postResolve

• **postResolve**: (`payload`: \{ `addResolvedCommands`: (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `resolvedCommands`: [`ResolvedCommand`](ResolvedCommand.md)[]  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.addResolvedCommands` | (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` | Add additional resolved commands to the context. **`Remarks`** After each command is resolved, it's options config is merged with the context's existing options config so that context is always up to date in the [`preResolveNext`](Hooks.md#preresolvenext) hook. Because of this, resolved commands can't be replaced once resolved, only added to. If you need to manually set the resolved commands, you can use the [`preResolve`](Hooks.md#preresolve) hook to do so. |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.resolvedCommands` | [`ResolvedCommand`](ResolvedCommand.md)[] | The resolved commands. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:73](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L73)

___

### postStateChange

• **postStateChange**: (`payload`: \{ `changed`: `Partial`\<[`NextState`](NextState.md)\> ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.changed` | `Partial`\<[`NextState`](NextState.md)\> | The changes that were applied to the state. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:174](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L174)

___

### preEnd

• **preEnd**: (`payload`: \{ `data`: `unknown` ; `setData`: (`data`: `unknown`) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.data` | `unknown` | The data that will be returned. |
| `payload.setData` | (`data`: `unknown`) => `void` | Override the data that will be returned. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:202](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L202)

___

### preExecute

• **preExecute**: (`payload`: \{ `initialData`: `unknown` ; `setInitialData`: (`data`: `unknown`) => `void` ; `setResultAndSkip`: (`result`: `unknown`) => `void` ; `skip`: () => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.initialData` | `unknown` | The initial data that was passed to the state. |
| `payload.setInitialData` | (`data`: `unknown`) => `void` | Override the state's initial data. |
| `payload.setResultAndSkip` | (`result`: `unknown`) => `void` | Set the final result and skip execution. |
| `payload.skip` | () => `void` | Skip execution. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:132](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L132)

___

### preNext

• **preNext**: (`payload`: \{ `data`: `unknown` ; `nextCommand`: `undefined` \| [`ResolvedCommand`](ResolvedCommand.md) ; `setData`: (`data`: `unknown`) => `void` ; `setNextCommand`: (`command`: [`ResolvedCommand`](ResolvedCommand.md)) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.data` | `unknown` | The data that will be passed to the next command. |
| `payload.nextCommand` | `undefined` \| [`ResolvedCommand`](ResolvedCommand.md) | The next command that will be executed. |
| `payload.setData` | (`data`: `unknown`) => `void` | Override the data that will be passed to the next command. |
| `payload.setNextCommand` | (`command`: [`ResolvedCommand`](ResolvedCommand.md)) => `void` | Override the next command that will be executed. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:182](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L182)

___

### preParse

• **preParse**: (`payload`: \{ `commandString`: `string` \| `string`[] ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `optionsConfig`: [`OptionsConfig`](../modules.md#optionsconfig) ; `setParseFn`: (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` ; `setParsedOptionsAndSkip`: (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void` ; `skip`: () => `void`  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.commandString` | `string` \| `string`[] | The command string that was passed to the CLI. |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.optionsConfig` | [`OptionsConfig`](../modules.md#optionsconfig) | The context's final options config from all plugins and resolved commands. |
| `payload.setParseFn` | (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` | Override the context's configured parse function. |
| `payload.setParsedOptionsAndSkip` | (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void` | Manually set the parsed options and skip parsing. |
| `payload.skip` | () => `void` | Skip parsing the command. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:94](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L94)

___

### preResolve

• **preResolve**: (`payload`: \{ `addResolvedCommands`: (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` ; `commandString`: `string` ; `commandsDir`: `string` ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `setParseFn`: (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` ; `setResolveFn`: (`resolveFn`: [`ResolveCommandFn`](../modules.md#resolvecommandfn)) => `void` ; `skip`: () => `void`  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.addResolvedCommands` | (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` | Add additional resolved commands to the context. |
| `payload.commandString` | `string` | The command string that was passed to the CLI. |
| `payload.commandsDir` | `string` | The path to the directory where the commands live. |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.setParseFn` | (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` | Override the context's configured parse function. |
| `payload.setResolveFn` | (`resolveFn`: [`ResolveCommandFn`](../modules.md#resolvecommandfn)) => `void` | Override the context's configured resolve function. |
| `payload.skip` | () => `void` | Skip resolving the command. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:14](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L14)

___

### preResolveNext

• **preResolveNext**: (`payload`: \{ `addResolvedCommands`: (`resolvedCommands`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` ; `commandString`: `string` ; `commandsDir`: `string` ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `lastResolved`: [`ResolvedCommand`](ResolvedCommand.md) ; `setParseFn`: (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` ; `setResolveFn`: (`resolveFn`: [`ResolveCommandFn`](../modules.md#resolvecommandfn)) => `void` ; `skip`: () => `void`  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.addResolvedCommands` | (`resolvedCommands`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` | Add additional resolved commands to the context. |
| `payload.commandString` | `string` | The remaining command string that needs to be resolved. |
| `payload.commandsDir` | `string` | The path to the directory where commands for the remaining command string live. Usually a subdirectory of the commands directory. |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.lastResolved` | [`ResolvedCommand`](ResolvedCommand.md) | The previously resolved command. |
| `payload.setParseFn` | (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` | Override the context's configured parse function. |
| `payload.setResolveFn` | (`resolveFn`: [`ResolveCommandFn`](../modules.md#resolvecommandfn)) => `void` | Override the context's configured resolve function. |
| `payload.skip` | () => `void` | Skip resolving the command. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:41](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L41)

___

### preStateChange

• **preStateChange**: (`payload`: \{ `changes`: `Partial`\<[`NextState`](NextState.md)\> ; `setChanges`: (`state`: `Partial`\<[`NextState`](NextState.md)\>) => `void` ; `skip`: () => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `MaybePromise`\<`void`\>

#### Type declaration

▸ (`payload`): `MaybePromise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.changes` | `Partial`\<[`NextState`](NextState.md)\> | The changes that will be applied to the state. |
| `payload.setChanges` | (`state`: `Partial`\<[`NextState`](NextState.md)\>) => `void` | Override the changes that will be applied to the state. |
| `payload.skip` | () => `void` | Skip the state change. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`MaybePromise`\<`void`\>

#### Defined in

[core/hooks.ts:159](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/hooks.ts#L159)
