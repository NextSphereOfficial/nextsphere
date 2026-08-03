/**
 * Single source of truth for the Privacy Policy "Last updated" date.
 * Update year and month (1-based) whenever the policy text changes.
 * Both EN and IT labels are derived from this value automatically.
 *
 * Stored as { year, month } rather than a Date object to avoid timezone
 * shifting: new Date('YYYY-MM-DD') parses as UTC midnight, which can fall
 * into the previous month for users west of UTC.
 */
export const PRIVACY_POLICY_DATE = { year: 2026, month: 8 } as const; // August 2026
