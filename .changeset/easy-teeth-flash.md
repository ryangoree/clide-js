---
"clide-js": minor
---

Remove `start` from the `State` type passed to command handlers since it's already started and can't be started again mid-execution.
