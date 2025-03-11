---
"clide-js": patch
---

Added a `customType` property to the `OptionConfig` object for casting options to a custom type that has been registered in the `OptionPrimitiveTypeMap`. The `type` property will only accept the built in types to ensure other dependent logic like parsing works as expected.
