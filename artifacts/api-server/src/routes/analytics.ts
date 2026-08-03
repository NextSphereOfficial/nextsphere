import { Router } from "express";
import { db, ctaEventsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const analyticsRouter = Router();

/** POST /analytics/cta  — record a single CTA click */
analyticsRouter.post("/analytics/cta", async (req, res) => {
  const { location, sessionId } = req.body as {
    location?: string;
    sessionId?: string;
  };

  if (!location || typeof location !== "string") {
    res.status(400).json({ error: "location (string) is required" });
    return;
  }

  try {
    await db.insert(ctaEventsTable).values({
      location,
      sessionId: sessionId ?? null,
      userAgent: (req.headers["user-agent"] as string) ?? null,
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log?.error(err, "Failed to insert cta_event");
    res.status(500).json({ error: "Failed to record event" });
  }
});

/** GET /analytics/cta  — aggregated click counts by location */
analyticsRouter.get("/analytics/cta", async (_req, res) => {
  try {
    const rows = await db
      .select({
        location: ctaEventsTable.location,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(ctaEventsTable)
      .groupBy(ctaEventsTable.location)
      .orderBy(sql`count(*) desc`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/**
 * GET /analytics/cta/timeseries  — daily click totals for the last 30 days,
 * broken down by location (for a line chart view).
 */
analyticsRouter.get("/analytics/cta/timeseries", async (_req, res) => {
  try {
    const rows = await db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${ctaEventsTable.clickedAt}), 'YYYY-MM-DD')`,
        location: ctaEventsTable.location,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(ctaEventsTable)
      .where(sql`${ctaEventsTable.clickedAt} >= now() - interval '30 days'`)
      .groupBy(
        sql`date_trunc('day', ${ctaEventsTable.clickedAt}), ${ctaEventsTable.location}`,
      )
      .orderBy(sql`date_trunc('day', ${ctaEventsTable.clickedAt})`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch time-series" });
  }
});

export default analyticsRouter;
