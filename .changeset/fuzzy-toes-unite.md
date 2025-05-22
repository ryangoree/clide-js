---
"clide-js": patch
---

Added a separate `CustomOptionTypes` interface to be the main register for custom option types rather than merging them directly into `OptionPrimitiveTypeMap` which could lead to some cryptic type errors if `skipLibCheck` is turned off.
