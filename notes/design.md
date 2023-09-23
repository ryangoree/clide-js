# clide

A framework for building powerful CLIs.

## Goals

- Exceptionally good developer experience
- Scalable
- Flexible
- Powerful
- Familiar

## clide design

As a CLI dev, I would like help to:

- Route commands to the right handlers
- Parse and validate options
- Prompt the user for input
- Debug development errors (e.g., state dumbs)
- Catch and format useful command errors
- Generate help messages and docs
- Suggest error solutions to the user
- Let users navigate through the CLI to explore (probably though prompt menus)
- Manage user config
- Hook into the command lifecycle
- Create chainable commands
- Give users a way to create and manage macros made up of chainable commands
- Maybe:
  - Create files
  - Load and validate files

While writing command handler logic, I might want to know:

- What path was taken to reach the current handler?
- What path is left?
- What was the full command?
- What is the final destination of the command?
- What handlers have I visited already and how many times?
- What options have I chosen?
- What data has been passed from previous commands/handlers?
- What is the current environment?
- What is the user's config?
- Is the current command part of a chain?
- Is the current command part of a macro?

## Features brainstorm

### Filesystem based routing

Filesystem based routing similar to Next.js will feel familiar to a large
developer base.

Position arguments could be done like next.js. Then options are only things
added with flags. This makes the difference between a command and a positional
argument more clear?

#### Resolution examples

**command:** `clide foo bar`

Things to consider for `foo`:

- How do you handle commands that end on `foo`?
- How do you add middleware to all subcommands of `foo`?

---

**files:**

- `src/commands/foo.ts` or `src/commands/foo/index.ts`

**command:** `clide foo`

- `foo.ts` handler used

**command:** `clide foo bar`

- command not found

---

**files:**

- `src/commands/foo/bar.ts`

**command:** `clide foo`

- command not found

**command:** `clide foo bar`

- `bar.ts` handler used

---

**files:**

- `src/commands/foo.ts` or `src/commands/foo/index.ts`
- `src/commands/foo/bar.ts`

**command:** `clide foo`

- `foo.ts` handler used

**command:** `clide foo bar`

- `foo.ts` then `bar.ts` handlers used

---

**files:**

- `src/commands/foo/[bar].ts`

**command:** `clide foo`

- command not found

**command:** `clide foo bar`

- `[bar].ts` handler used with `bar` argument equal to `'bar'`

**command:** `clide foo bar baz`

- command not found

---

**files:**

- `src/commands/foo/[...bar].ts`

**command:** `clide foo`

- command not found

**command:** `clide foo bar`

- `[bar].ts` handler used with `bar` argument equal to `['bar']`

**command:** `clide foo bar baz`

- `[bar].ts` handler used with `bar` argument equal to `['bar', 'baz']`

---

**files:**

- `src/commands/foo/[bar]/baz.ts`

**command:** `clide foo`

- command not found

**command:** `clide foo bar`

- command not found

**command:** `clide foo bar baz`

- `baz.ts` handler used with `bar` argument equal to `'bar'`

### Streams

Use the `Readable` and `Writable` node.js streams to enable command chaining and
hooks.

### Lifecycle Hooks

Hooks for different stages of command execution which allow contributors to build things like:

- caching
- custom logging
- analytics
- rate-limiting

### Mini DSL for Macros

A simple language for combining existing CLI commands into macros. For example:

```cml
macro create-deploy {
  run setup-env
  run build --env=$1
  run deploy --tag=$2
}
```

https://pegjs.org/, https://nearley.js.org/, https://ohmjs.org/

#### Shell Scripts vs DSL

**Portability**: Not all CLI users will be comfortable writing shell scripts, or might be on systems where running them is inconvenient. A DSL could be more user-friendly and system-agnostic.

**Validation**: A DSL could include syntax validation, auto-suggestions, and even some level of type checking for arguments. This is harder to do cleanly in a shell script.

**Namespacing**: A DSL provides control over the 'global' namespace, making it easier to prevent command clashes or to introduce new features without breaking existing macros.

**Discoverability**: Since it's a defined language, it would be easier to create helper tools, documentation, and examples to aid in discovery and learning.

### Plugin Registry

Allows contributors to build stand-alone plugins that can be registered with the
CLI. Things like:

- custom formatters
- help/doc generators
- caching mechanisms.

### Common file operations

- CRUD operations for files. Maybe even directory scaffolding based on a template.

### Config:

- JsonStore (SQLite in extreme cases?)

### Option Conflict Handling

- An easy way to declare and handle option conflicts

An example of a CLI built with `yargs` handling option conflicts manually: https://github.com/jestjs/jest/blob/main/packages/jest-cli/src/args.ts

### Security

- [ ] Mitigate command injection
- [ ] Sanitize and validate user input

### Powerful:

- Think about a way to run command clusters in parallel.

## Sandbox

```ts
/*

command anatomy:

 clide create --template foo mycli
|_________________________________|
                |
             command


 clide create --template foo mycli
      |______|
         |
       token


 clide create --template foo mycli
             |______________|
                    |
                  option


command chaining:

 mycli calc-max foo | mcli encode | mycli broadcast
|__________________| |___________| |_______________|
         |                 |               |
      command           command         command


 mycli macro calc-max foo => encode => broadcast
            |____________|  |______|  |_________|
                  |             |          |
               command       command    command

*/

// final command
export default async function deploy({
  data,
  options,
  config,
}: TokenArgs): TokenResult<{ success: boolean }> {
  // not sure how this would work yet
  useRateLimiting(data)

  const getOption = options({
    r: {
      alias: ['rpc-url'],
      /**
       * The type of the option (optional, has default based on `default`).
       */
      type: 'string',
      /**
       * The description of the option (optional, has default based on `name`).
       */
      description: 'RPC URL used to deploy the contract',
      /**
       * The prompt to show the user if no value is provided (optional).
       */
      prompt: 'Please provide an RPC URL',
      /**
       * The default value the prompt will show (optional).
       */
      default: config.get('rpcUrl'),
      /**
       * Prompts the user for the option if it's not present and requires the
       * user enters a valid value. If no `prompt` field is provided, a default
       * will be used based on `name`.
       */
      required: true,
      /**
       * The autocomplete function (optional).
       */
      autoComplete: async (input) => {
        // matching logic against `input`
        return [
          // return matching values
        ]
      },
      // autoComplete: [
      //   // potential values, engine will manage matching
      // ]
      /**
       * The validation function (optional).
       */
      validate: (value) => {
        // return true if valid, false otherwise
      },
    },
  })

  // triggers prompt if no option is provided
  const rpcUrl = await getOption('rpc-url');

  // deploy a thing...

  return result({ success: true })
}

// middleware-like command
export default async function deploy({
  next,
  options,
  config,
}: TokenArgs): TokenNext<{ rpcUrl: String }> {
  const getOption = options({
    // ...
  })
  return next({ rpcUrl: await getOption('rpc-url') })
}

// commands/deploy/foo.ts
export function foo({
  // rpc url is provided by the previous token/command rather than the option
  // how can I give guidance to developers on when something should come from
  // options vs when it should come from data? What about both?
  data: { rpcUrl },
  end,
}): TokenEnd<{ success: boolean }> {
  // deploy a foo...

  return end({ success: true })
}

const getOption = options({
  foo: {},
  bar: {},
})
let foo = await getOption('foo')
/** Options can override their options at the time that they're called. */
let bar = await getOption('bar', {
  required: !foo,
  prompt: !foo ? 'Please provide a bar' : undefined,
})

const cli = clide.execute({
  commandsDir: './commands',
  // register plugins during startup
  plugins: [basicLogger, tokenCounter],
  command: hideBin(process.argv),
})

async function execute({ plugins, commandsDir, command, initialData }) {
  const { tokens, options } = parseCommand(command)

  const steps = tokens.map((_, i) => async (...args) => {
    const handler = await loadHandler(tokens.slice(0, i + 1))
    return handler(...args)
  })

  const emitter = new ClideEmitter(...)
  const client = new ClideClient({ tokens, options });

  const state = {
    // how will streams be implemented?
    // stream,
    plugins: [],
    tokens,
    options,
    i: -1,
    // that data the will eventually get returned to stdout or a stream
    data: undefined,

    // modify the data and continue to the next step if there is one, otherwise
    // return the data.
    result: async (data) => {
      state.data = data
      emitter.emit('result', {
        client,
        emitter,
        state,
      })
      const nextHandler = steps[state.i + 1]
      if (nextHandler) {
        state.i++
        return await nextHandler(Object.freeze({ ...state }))
      }
      return data
    },

    // modify the data and continue to the next step if there is one, otherwise
    // throw an error.
    next: async (data) => {
      const nextHandler = steps[state.i + 1]
      if (!nextHandler) client.error(new Error(`No next step`))
      state.data = data
      // should this be called before throwing an error?
      emitter.emit(['result', 'next'], {
        client,
        emitter,
        state,
      })
      state.i++
      return await nextHandler(Object.freeze({ ...state }))
    },

    // modify the data and return it, logging a warning if there were more steps
    end: (data) => {
      state.data = data
      emitter.emit(['result', 'end'], {
        client,
        emitter,
        state,
      })
      if (steps[state.i + 1]) {
        client.warn('Ending prematurely, remaining steps will be skipped.')
      }
      return data
    },
  }

  // init plugins
  for (const plugin of plugins) {
    plugin.init({
      client,
      emitter,
      state: Object.freeze({ ...state }),
    })
    state.plugins.push(plugin.meta)
  }

  return state.next(initialData)
}

// an example of a token handler ending early after a timeout
({ result, end }) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      reject(end(new Error('timed out')))
    }, 1000),
  )
  return Promise.race([result({ name: 'ryan' }), timeout])
},

function basicLogger(emitter) {
  emitter.on('token', (state, client) => {
    client.logTable(state)
  })
}

function tokenCounter(emitter) {
  let count = 0

  emitter.on('token', () => count++)

  // not sure where these get called yet or how they persist through a stream
  return {
    getCount() {
      return count
    },
  }
}

// later in a command, e.g. commands/foo/bar.ts
export function bar({ data }) {
  // a hook provided by the tokenCounter plugin
  const count = useCounter()
}
```
