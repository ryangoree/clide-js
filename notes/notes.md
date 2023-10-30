## TODOs

- [ ] Add `readonly` to types where appropriate
- [ ] Analyze immutability throughout

## Features TODO

- [x] Filesystem based command router
- [x] Param routes
- [x] Options getter
  - [x] Options config
  - [x] Option parsing
    - [x] string
    - [x] number
    - [x] boolean
    - [x] array
  - [x] Types
  - [x] Getter fns
  - [x] Validation
  - [x] Prompting
  - [x] Relationships (dependencies and conflicts)
- [x] Help menu
- [ ] Command suggestions (Did you mean?)
- [ ] Tab autocomplete
- [x] Hooks
- [ ] User config
- [ ] Build
- [ ] Chaining
- [ ] VSCode plugin
  - [ ] Param types
  - [ ] Inherited option types
- [ ] ESLint plugin
  - [ ] No unreachable subcommands
- [ ] Parallel command clusters
- [ ] Macros
- [ ] DSL
- [ ] Dev tools?

### Security Risks of Not Sanitizing Tokens

- command injection
- directory traversal

**Solution**: whitelist?

---

### Expanding on the Emitter Wrapper

- Event Throttling
- Prioritizing Events
- Blacklisting or whitelisting event names

### Libraries

https://github.com/sindresorhus/awesome-nodejs#command-line-utilities

**Redirecting stdout:**

- https://www.npmjs.com/package/execa
- https://www.npmjs.com/package/execa

**Coloring:**

- https://github.com/lukeed/kleur

**Temp file paths:**

- https://www.npmjs.com/package/tempy

### Context

Create a context interface that includes `State`, `Client`, etc.

### Lint and VSCode

- https://tsup.egoist.dev/#json-schema-store

### Execute commands from other commands

- initialData: context.data,

### Naming

- cmdcraft
- pathpilot
- Cmdex
- argonaut
- argarch