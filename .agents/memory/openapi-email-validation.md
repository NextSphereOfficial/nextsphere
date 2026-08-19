---
name: OpenAPI email validation
description: Orval/Zod compatibility requirement for email fields in the workspace OpenAPI contract.
---

Use a regex pattern for email fields in the OpenAPI contract instead of `format: email`.

**Why:** The current Orval generator emits `zod.email()` from `format: email`, but the workspace uses Zod 3, which does not expose that API. Contract generation succeeds but the subsequent library typecheck fails.

**How to apply:** When adding an email input to `lib/api-spec/openapi.yaml`, use `type: string` with the standard email pattern and any desired maximum length, then run the normal code-generation command.