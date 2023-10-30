[clide-js](../README.md) / [Exports](../modules.md) / RunOptions

# Interface: RunOptions

Options for the [`run`](../modules.md#run) function.

## Table of contents

### Properties

- [afterExecute](RunOptions.md#afterexecute)
- [afterParse](RunOptions.md#afterparse)
- [afterResolve](RunOptions.md#afterresolve)
- [beforeEnd](RunOptions.md#beforeend)
- [beforeExecute](RunOptions.md#beforeexecute)
- [beforeNext](RunOptions.md#beforenext)
- [beforeParse](RunOptions.md#beforeparse)
- [beforeResolve](RunOptions.md#beforeresolve)
- [command](RunOptions.md#command)
- [commandsDir](RunOptions.md#commandsdir)
- [initialData](RunOptions.md#initialdata)
- [onError](RunOptions.md#onerror)
- [plugins](RunOptions.md#plugins)

## Properties

### afterExecute

• `Optional` **afterExecute**: (`payload`: \{ `result`: `unknown` ; `setResult`: (`result`: `unknown`) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs once all commands have been called or when `context.end()`
is called.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.result` | `unknown` | The final result. |
| `payload.setResult` | (`result`: `unknown`) => `void` | Override the final result. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`void`

#### Defined in

[core/run.ts:58](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L58)

___

### afterParse

• `Optional` **afterParse**: (`payload`: \{ `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `parsedOptions`: [`OptionValues`](../modules.md#optionvalues) ; `setParsedOptions`: (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void`  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs after parsing the command string.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.parsedOptions` | [`OptionValues`](../modules.md#optionvalues) | The resulting parsed options. |
| `payload.setParsedOptions` | (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void` | Override the parsed options. |

##### Returns

`void`

#### Defined in

[core/run.ts:49](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L49)

___

### afterResolve

• `Optional` **afterResolve**: (`payload`: \{ `addResolvedCommands`: (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `resolvedCommands`: [`ResolvedCommand`](ResolvedCommand.md)[]  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs after importing command modules.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.addResolvedCommands` | (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` | Add additional resolved commands to the context. **`Remarks`** After each command is resolved, it's options config is merged with the context's existing options config so that context is always up to date in the [`preResolveNext`](Hooks.md#preresolvenext) hook. Because of this, resolved commands can't be replaced once resolved, only added to. If you need to manually set the resolved commands, you can use the [`preResolve`](Hooks.md#preresolve) hook to do so. |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.resolvedCommands` | [`ResolvedCommand`](ResolvedCommand.md)[] | The resolved commands. |

##### Returns

`void`

#### Defined in

[core/run.ts:40](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L40)

___

### beforeEnd

• `Optional` **beforeEnd**: (`payload`: \{ `data`: `unknown` ; `setData`: (`data`: `unknown`) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs before executing the `context.end()` function.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.data` | `unknown` | The data that will be returned. |
| `payload.setData` | (`data`: `unknown`) => `void` | Override the data that will be returned. |
| `payload.state` | [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\> | The state object. |

##### Returns

`void`

#### Defined in

[core/run.ts:66](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L66)

___

### beforeExecute

• `Optional` **beforeExecute**: (`payload`: \{ `initialData`: `unknown` ; `setInitialData`: (`data`: `unknown`) => `void` ; `setResultAndSkip`: (`result`: `unknown`) => `void` ; `skip`: () => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs before calling the first command.

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

`void`

#### Defined in

[core/run.ts:53](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L53)

___

### beforeNext

• `Optional` **beforeNext**: (`payload`: \{ `data`: `unknown` ; `nextCommand`: `undefined` \| [`ResolvedCommand`](ResolvedCommand.md) ; `setData`: (`data`: `unknown`) => `void` ; `setNextCommand`: (`command`: [`ResolvedCommand`](ResolvedCommand.md)) => `void` ; `state`: [`State`](../classes/State.md)\<`unknown`, [`OptionsConfig`](../modules.md#optionsconfig)\>  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs before executing the `context.next()` function.

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

`void`

#### Defined in

[core/run.ts:62](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L62)

___

### beforeParse

• `Optional` **beforeParse**: (`payload`: \{ `commandString`: `string` \| `string`[] ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `optionsConfig`: [`OptionsConfig`](../modules.md#optionsconfig) ; `setParseFn`: (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` ; `setParsedOptionsAndSkip`: (`optionValues`: [`OptionValues`](../modules.md#optionvalues)) => `void` ; `skip`: () => `void`  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs before parsing the command string using the options config
from plugins and imported command modules.

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

`void`

#### Defined in

[core/run.ts:45](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L45)

___

### beforeResolve

• `Optional` **beforeResolve**: (`payload`: \{ `addResolvedCommands`: (`result`: [`ResolvedCommand`](ResolvedCommand.md)[]) => `void` ; `commandString`: `string` ; `commandsDir`: `string` ; `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `setParseFn`: (`parseFn`: [`ParseCommandFn`](../modules.md#parsecommandfn)) => `void` ; `setResolveFn`: (`resolveFn`: [`ResolveCommandFn`](../modules.md#resolvecommandfn)) => `void` ; `skip`: () => `void`  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs before attempting to locate and import command modules.

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

`void`

#### Defined in

[core/run.ts:36](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L36)

___

### command

• `Optional` **command**: `string` \| `string`[]

The command string or array to be parsed and executed. If not provided, it
defaults to system arguments.

#### Defined in

[core/run.ts:19](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L19)

___

### commandsDir

• `Optional` **commandsDir**: `string`

A directory path containing command modules.

**`Default`**

```ts
"<cwd>/commands" || "<caller-dir>/commands"
```

#### Defined in

[core/run.ts:24](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L24)

___

### initialData

• `Optional` **initialData**: `any`

Initial context or data to pass to commands during execution.

#### Defined in

[core/run.ts:28](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L28)

___

### onError

• `Optional` **onError**: (`payload`: \{ `context`: [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> ; `error`: `unknown` ; `ignore`: () => `void` ; `setError`: (`error`: `unknown`) => `void`  }) => `void`

#### Type declaration

▸ (`payload`): `void`

A hook that runs whenever an error is thrown.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Object` | - |
| `payload.context` | [`Context`](../classes/Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> | The command's context object. |
| `payload.error` | `unknown` | The error that was thrown. |
| `payload.ignore` | () => `void` | Prevent the error from being thrown. |
| `payload.setError` | (`error`: `unknown`) => `void` | Override the error that will be thrown. |

##### Returns

`void`

#### Defined in

[core/run.ts:70](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L70)

___

### plugins

• `Optional` **plugins**: [`Plugin`](Plugin.md)[]

An array of plugins that can modify or augment the behavior of commands.

#### Defined in

[core/run.ts:32](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/run.ts#L32)
