import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { RefreshCw, Lock, TrendingUp, MousePointerClick, BarChart2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CtaStat {
  location: string;
  count: number;
}

interface TimeseriesRow {
  date: string;
  location: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const LOCATION_LABELS: Record<string, string> = {
  hero_primary:    'Hero – Primary',
  hero_secondary:  'Hero – Secondary',
  pricing:         'Pricing',
  final_banner:    'Final Banner',
  navbar_desktop:  'Navbar (Desktop)',
  navbar_mobile:   'Navbar (Mobile)',
};

const COLORS = [
  '#DEB67D', // gold primary
  '#B8924F',
  '#E8CFA0',
  '#9A7840',
  '#F5E6C8',
  '#7A5F30',
];

function labelOf(loc: string) {
  return LOCATION_LABELS[loc] ?? loc;
}

/** Build a pivot table from time-series rows for a multi-line chart */
function pivotTimeseries(rows: TimeseriesRow[]): Record<string, number | string>[] {
  const map = new Map<string, Record<string, number | string>>();
  const locations = new Set<string>();

  for (const r of rows) {
    locations.add(r.location);
    if (!map.has(r.date)) map.set(r.date, { date: r.date });
    map.get(r.date)![r.location] = r.count;
  }
  // Ensure every row has every location key (0 if missing)
  for (const entry of map.values()) {
    for (const loc of locations) {
      if (entry[loc] === undefined) entry[loc] = 0;
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );
}

// ---------------------------------------------------------------------------
// Password gate
// ---------------------------------------------------------------------------
const CORRECT_PASSWORD =
  (import.meta.env.VITE_ANALYTICS_PASS as string | undefined) ?? 'nextsphere2025';

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setValue('');
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Lock size={26} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">CTA Conversion Dashboard</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                error ? 'border-red-500/60' : 'border-white/10'
              }`}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">Incorrect password</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

async function fetchStats(): Promise<CtaStat[]> {
  const res = await fetch(`${BASE}/api/analytics/cta`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchTimeseries(): Promise<TimeseriesRow[]> {
  const res = await fetch(`${BASE}/api/analytics/cta/timeseries`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function Dashboard() {
  const [stats, setStats] = useState<CtaStat[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, t] = await Promise.all([fetchStats(), fetchTimeseries()]);
      setStats(s);
      setTimeseries(t);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh every 60 seconds
  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const total = stats.reduce((s, r) => s + r.count, 0);
  const topLocation = stats[0];
  const uniqueLocations = stats.length;

  const barData = stats.map((r, i) => ({
    name: labelOf(r.location),
    clicks: r.count,
    fill: COLORS[i % COLORS.length],
  }));

  const locations = [...new Set(timeseries.map((r) => r.location))];
  const pivoted = pivotTimeseries(timeseries);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">CTA Conversion Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : 'Loading…'}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total CTA Clicks"
            value={total}
            sub="all time"
            icon={MousePointerClick}
          />
          <StatCard
            label="Top Section"
            value={topLocation ? labelOf(topLocation.location) : '—'}
            sub={topLocation ? `${topLocation.count} clicks` : undefined}
            icon={TrendingUp}
          />
          <StatCard
            label="Tracked Sections"
            value={uniqueLocations}
            sub="hero, pricing, navbar, banner"
            icon={BarChart2}
          />
        </div>

        {/* Bar chart */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-1">Clicks by CTA Section</h2>
          <p className="text-gray-500 text-xs mb-6">All-time totals</p>

          {loading && stats.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600">
              Loading…
            </div>
          ) : stats.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
              No click data yet — interact with a CTA to see it here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  formatter={(v: number) => [v, 'Clicks']}
                />
                <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line chart – 30-day timeseries */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-1">Daily Clicks — Last 30 Days</h2>
          <p className="text-gray-500 text-xs mb-6">Broken down by section</p>

          {loading && timeseries.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600">
              Loading…
            </div>
          ) : timeseries.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
              No data for the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={pivoted}
                margin={{ top: 0, right: 0, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)} // MM-DD
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#fff',
                  }}
                  formatter={(v: number, name: string) => [v, labelOf(name)]}
                />
                <Legend
                  formatter={(v: string) => (
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>
                      {labelOf(v)}
                    </span>
                  )}
                />
                {locations.map((loc, i) => (
                  <Line
                    key={loc}
                    type="monotone"
                    dataKey={loc}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Raw table */}
        {stats.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8">
              <h2 className="text-base font-semibold">Section Breakdown</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Section</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Clicks</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((r, i) => (
                  <tr key={r.location} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-gray-200">{labelOf(r.location)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      {r.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {total > 0 ? `${((r.count / total) * 100).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page entry
// ---------------------------------------------------------------------------
export default function Analytics() {
  const [unlocked, setUnlocked] = useState(false);

  // Persist unlock in session storage so page refresh doesn't log out
  useEffect(() => {
    if (sessionStorage.getItem('ns_analytics_unlocked') === '1') {
      setUnlocked(true);
    }
  }, []);

  function handleUnlock() {
    sessionStorage.setItem('ns_analytics_unlocked', '1');
    setUnlocked(true);
  }

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />;
  return <Dashboard />;
}
