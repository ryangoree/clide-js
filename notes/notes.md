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
    - [`validateOptions`](/packages/clide-js/src/core/options/validate-options.ts) validates these settings, but isn't used anywhere 🤔
- [x] Help menu
- [ ] Command suggestions (Did you mean?)
  - Started work on this in [`findSimilar`](/packages/clide-js/src/utils/find-similar.ts)
- [ ] Tab autocomplete
- [x] Hooks
- [ ] User config
  - Started work in [extras/config](/packages/extras/src/config/)
- [ ] Create script `npx create-clide-js-app`, `npx create-clide-app`
- [x] Command Chaining
- [ ] VSCode plugin
  - [ ] Param types
  - [ ] Inherited option types
  - [ ] Data types (idk if this is possible)
- [ ] ESLint plugin
  - [ ] No unreachable subcommands
  - [ ] Command handlers must end in explicit state action? (`next`, `end`)
- [ ] Parallel command clusters
- [ ] Macros
- [ ] DSL
- [ ] Dev tools?

### Security Risks of Not Sanitizing Tokens

- command injection
- directory traversal

### Libraries

https://github.com/sindresorhus/awesome-nodejs#command-line-utilities

**Redirecting stdout:**

- https://www.npmjs.com/package/execa

**Coloring:**

- https://github.com/lukeed/kleur

**Temp file paths:**

- https://www.npmjs.com/package/tempy
