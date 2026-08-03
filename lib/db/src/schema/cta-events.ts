import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const ctaEventsTable = pgTable("cta_events", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
});

export type CtaEvent = typeof ctaEventsTable.$inferSelect;
export type InsertCtaEvent = typeof ctaEventsTable.$inferInsert;
