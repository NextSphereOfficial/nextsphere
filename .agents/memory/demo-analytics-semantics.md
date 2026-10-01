---
name: Demo analytics semantics
description: Privacy and interpretation constraints for demo engagement reporting
---

Keep demo reporting at viewing-run level; do not call event totals unique people
or completed platform registrations, and do not add persistent visitor IDs just
to construct a funnel.

**Why:** The agreed scope uses the existing Vercel service and API counters
without PII or a new tracker. No external platform conversion data is available.
Repeated visits and replays are not evidence of additional unique people.

**How to apply:** Compare starts/completions using matching initial/replay and
automatic/manual filters in one data source and time window. If adding genuine
cross-platform conversion attribution later, agree its privacy and data-source
requirements first rather than inferring it from demo CTA clicks.