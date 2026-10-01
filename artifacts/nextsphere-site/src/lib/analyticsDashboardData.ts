export interface AnalyticsCount {
  location: string;
  count: number;
}

export interface DemoOpenCounts {
  total: number;
  hero: number;
  teaser: number;
}

export interface DemoViewingCounts {
  starts: number;
  completions: number;
}

const DEMO_OPEN_LOCATIONS = ['demo_open_hero', 'demo_open_teaser'];

export function isDemoOpenLocation(location: string): boolean {
  return location.startsWith('demo_open_');
}

/** Keep demo intent and playback counters out of platform CTA totals. */
export function platformCtaRows<T extends AnalyticsCount>(rows: T[]): T[] {
  return rows.filter((row) =>
    row.location !== 'demo_section_view'
    && !row.location.startsWith('demo_video_')
    && !isDemoOpenLocation(row.location)
  );
}

export function demoOpenCounts(rows: AnalyticsCount[]): DemoOpenCounts {
  const byLocation = new Map(rows.map((row) => [row.location, row.count]));
  const hero = byLocation.get(DEMO_OPEN_LOCATIONS[0]) ?? 0;
  const teaser = byLocation.get(DEMO_OPEN_LOCATIONS[1]) ?? 0;
  return { total: hero + teaser, hero, teaser };
}

/** These counters represent playback runs, not people or platform conversions. */
export function demoViewingCounts(rows: AnalyticsCount[]): DemoViewingCounts {
  return rows.reduce(
    (totals, row) => {
      if (/^demo_video_start_(auto|manual)_(initial|replay)$/.test(row.location)) {
        totals.starts += row.count;
      } else if (/^demo_video_complete_(auto|manual)_(initial|replay)$/.test(row.location)) {
        totals.completions += row.count;
      }
      return totals;
    },
    { starts: 0, completions: 0 },
  );
}