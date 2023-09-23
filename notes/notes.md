## TODOs

- [ ] Add `readonly` to types where appropriate
- [ ] Analyze immutability throughout

## Features TODO

- [x] Filesystem based command router
- [x] Param routes
- [ ] Options getter
  - [x] Options config
  - [ ] Option parsing
    - [x] string
    - [x] number
    - [x] boolean
    - [ ] array
  - [x] Types
  - [x] Getter fns
  - [x] Validation
  - [x] Prompting
  - [x] Relationships (dependencies and conflicts)
- [x] Help menu
- [ ] Command suggestions (Did you mean?)
- [ ] Tab autocomplete
- [x] Events
- [ ] Hooks
- [ ] User config
- [ ] Build
- [ ] Chaining
- [ ] VSCode plugin
  - [ ] Param types
  - [ ] Parent command option types
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