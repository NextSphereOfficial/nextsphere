---
name: Pnpm workspace relinking
description: Filtered dependency updates can temporarily leave peer-dependent symlinks stale in this workspace.
---

After a filtered pnpm dependency update, do a frozen install before diagnosing newly missing frontend types or modules.

**Why:** A successful server dependency update refreshed the lockfile's peer resolution, but the site's existing Vite symlink still pointed to the previous resolution. The immediate workspace typecheck then reported a missing Vite client type; a frozen install relinked dependencies and the full checks passed.

**How to apply:** When workspace-wide checks fail only after a dependency update, compare the lockfile resolution with local symlink targets and run `pnpm install --frozen-lockfile` before changing source or adding dependencies.
