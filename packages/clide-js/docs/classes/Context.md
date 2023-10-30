[clide-js](../README.md) / [Exports](../modules.md) / Context

# Class: Context\<TOptions\>

The command lifecycle manager.

The `Context` serves as the orchestrator for the entire command lifecycle. It
is responsible for initializing the CLI environment, resolving commands,
parsing options, and managing execution flow. It ensures that all aspects of
the CLI are prepared and ready before any action is taken, establishing a
predictable and stable execution environment.

Philosophy:
- Immutable Configuration: Once the context is prepared, its configuration
  should not change. This immutability guarantees consistency throughout the
  CLI's operation and avoids side effects that could arise from dynamic
  changes in the environment.
- Explicit Lifecycle Management: By clearly defining lifecycle hooks and
  preparation stages, `Context` offers explicit control over the command
  execution process, allowing for extensibility and customization without
  sacrificing predictability.
- Separation of Concerns: `Context` focuses on the setup and execution
  environment, while `State` manages the actual progression and state changes
  during command execution. This separation ensures that each module only
  handles its designated responsibilities, making the system easier to
  maintain and extend.
- Fail-fast Philosophy: The context should catch and handle errors as early
  as possible (during the preparation phase), ensuring that execution only
  proceeds when all systems are nominal. The exception to this rule is
  option validation, which is performed dynamically when options are accessed
  during execution. This is done to give command handlers the ability to
  gracefully handle missing or invalid options and potentially prompt the
  user for the missing information.

Scope:
- Plugin Initialization: Loading and preparing all plugins for the execution
  cycle.
- Command Resolution: Determining the sequence of command modules to be
  executed based on the input string.
- Option Parsing: Interpreting command-line arguments and flags into a
  structured format for consumption by commands.
- Execution Readiness: Ensuring that the context has been fully prepared
  before allowing the execution to proceed.
- Error Management: Providing a centralized mechanism for error handling
  during the preparation and execution phases.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TOptions` | extends [`OptionsConfig`](../modules.md#optionsconfig) = [`OptionsConfig`](../modules.md#optionsconfig) |

## Table of contents

### Accessors

- [isParsed](Context.md#isparsed)
- [isReady](Context.md#isready)
- [isResolved](Context.md#isresolved)
- [options](Context.md#options)
- [parsedOptions](Context.md#parsedoptions)
- [resolvedCommands](Context.md#resolvedcommands)
- [result](Context.md#result)

### Constructors

- [constructor](Context.md#constructor)

### Methods

- [addOptions](Context.md#addoptions)
- [execute](Context.md#execute)
- [parseCommand](Context.md#parsecommand)
- [prepare](Context.md#prepare)
- [resolveCommand](Context.md#resolvecommand)
- [throw](Context.md#throw)
- [prepare](Context.md#prepare-1)

### Properties

- [client](Context.md#client)
- [commandString](Context.md#commandstring)
- [commandsDir](Context.md#commandsdir)
- [hooks](Context.md#hooks)
- [plugins](Context.md#plugins)

## Accessors

### isParsed

• `get` **isParsed**(): `boolean`

A boolean indicating whether the command string has been parsed.

#### Returns

`boolean`

#### Defined in

[core/context.ts:161](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L161)

___

### isReady

• `get` **isReady**(): `boolean`

A boolean indicating whether the context is ready for execution.

#### Returns

`boolean`

#### Defined in

[core/context.ts:169](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L169)

___

### isResolved

• `get` **isResolved**(): `boolean`

A boolean indicating whether the commands have been resolved.

#### Returns

`boolean`

#### Defined in

[core/context.ts:153](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L153)

___

### options

• `get` **options**(): `TOptions`

The options config for the command.

#### Returns

`TOptions`

#### Defined in

[core/context.ts:149](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L149)

___

### parsedOptions

• `get` **parsedOptions**(): [`OptionValues`](../modules.md#optionvalues)

The parsed option values for the command.

#### Returns

[`OptionValues`](../modules.md#optionvalues)

#### Defined in

[core/context.ts:165](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L165)

___

### resolvedCommands

• `get` **resolvedCommands**(): [`ResolvedCommand`](../interfaces/ResolvedCommand.md)[]

A list of the resolved commands.

#### Returns

[`ResolvedCommand`](../interfaces/ResolvedCommand.md)[]

#### Defined in

[core/context.ts:157](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L157)

___

### result

• `get` **result**(): `unknown`

The result of the most recent execution.

#### Returns

`unknown`

#### Defined in

[core/context.ts:173](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L173)

## Constructors

### constructor

• **new Context**\<`TOptions`\>(`«destructured»`): [`Context`](Context.md)\<`TOptions`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TOptions` | extends [`OptionsConfig`](../modules.md#optionsconfig) = [`OptionsConfig`](../modules.md#optionsconfig) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ContextOptions`](../interfaces/ContextOptions.md)\<`TOptions`\> |

#### Returns

[`Context`](Context.md)\<`TOptions`\>

#### Defined in

[core/context.ts:111](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L111)

## Methods

### addOptions

▸ **addOptions**(`options`): `void`

Append additional options to the context's options config. Typically, this
is done by plugins during initialization.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`OptionsConfig`](../modules.md#optionsconfig) | The options config to be merged with the context's options config. |

#### Returns

`void`

#### Defined in

[core/context.ts:219](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L219)

___

### execute

▸ **execute**(`initialData?`): `Promise`\<`void`\>

Execute the context's command string.

This function will override the context's result with the result of the
final command in the chain each time it is called.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialData?` | `any` | Optional data to be passed to the first command in the chain. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/context.ts:293](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L293)

___

### parseCommand

▸ **parseCommand**(`commandString?`, `optionsConfig?`): `MaybePromise`\<[`ParsedCommand`](../modules.md#parsedcommand)\>

Parse a command string into a structured object using the configured
`parseFn` and the context's options config.

This function has no side effects and is simply a wrapper around the
configured `parseFn`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandString` | `string` | The command string to be parsed. Defaults to the context's command string. |
| `optionsConfig?` | [`OptionsConfig`](../modules.md#optionsconfig) | Additional options config to be merged with the context's options config. |

#### Returns

`MaybePromise`\<[`ParsedCommand`](../modules.md#parsedcommand)\>

A `ParsedCommand` object containing the parsed command tokens and
option values.

#### Defined in

[core/context.ts:274](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L274)

___

### prepare

▸ **prepare**(): `Promise`\<`void`\>

Prepare the context for execution.

1. Initialize plugins
2. Resolve the command string into a list of imported command modules
3. Parse the command string with the final options config from plugins and
   commands
5. Mark the context as ready

#### Returns

`Promise`\<`void`\>

**`Remarks`**

This method is idempotent.

#### Defined in

[core/context.ts:188](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L188)

___

### resolveCommand

▸ **resolveCommand**(`commandString?`, `commandsDir?`): `Promise`\<[`ResolvedCommand`](../interfaces/ResolvedCommand.md)\>

Resolve a command string into a list of imported command modules using
the configured `resolveFn` and `parseFn`.

This function has no side effects and is simply a wrapper around the
configured `resolveFn` and `parseFn`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandString` | `string` | The command string to be resolved. Defaults to the context's command string. |
| `commandsDir` | `string` | The path to the directory containing command modules. Defaults to the context's commands directory. |

#### Returns

`Promise`\<[`ResolvedCommand`](../interfaces/ResolvedCommand.md)\>

A `ResolvedCommand` object.

#### Defined in

[core/context.ts:237](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L237)

___

### throw

▸ **throw**(`error`): `Promise`\<`void`\>

Throw an error, allowing hooks to modify the error or ignore it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `unknown` | The error to be thrown. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/context.ts:357](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L357)

___

### prepare

▸ **prepare**(`options`): `Promise`\<[`Context`](Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\>\>

Create a new `Context` instance and automatically prep it for execution.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ContextOptions`](../interfaces/ContextOptions.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\> |

#### Returns

`Promise`\<[`Context`](Context.md)\<[`OptionsConfig`](../modules.md#optionsconfig)\>\>

#### Defined in

[core/context.ts:142](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L142)

## Properties

### client

• `Readonly` **client**: [`Client`](Client.md)

The standard streams client.

#### Defined in

[core/context.ts:86](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L86)

___

### commandString

• `Readonly` **commandString**: `string`

The command string to be executed.

#### Defined in

[core/context.ts:82](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L82)

___

### commandsDir

• `Readonly` **commandsDir**: `string`

The path to the directory containing command modules.

#### Defined in

[core/context.ts:84](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L84)

___

### hooks

• `Readonly` **hooks**: [`HooksEmitter`](HooksEmitter.md)

The hooks emitter.

#### Defined in

[core/context.ts:88](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L88)

___

### plugins

• `Readonly` **plugins**: `Record`\<`string`, [`PluginInfo`](../interfaces/PluginInfo.md) & \{ `isReady`: `boolean`  }\>

Metadata about the plugins that will be used during preparation and
execution.

#### Defined in

[core/context.ts:93](https://github.com/ryangoree/clide-js/blob/3edecc0/packages/clide-js/src/core/context.ts#L93)
