export interface CountingStats {
  singles: number;
  doubles: number;
  triples: number;
  hr: number;
  rbi: number;
  runs: number;
  bb: number;
  k: number;
  sb: number;
  cs: number;
  outs: number;
}

export interface DerivedStats {
  hits: number;
  atBats: number;
  totalBases: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
}

export const COUNTING_STAT_KEYS = [
  'singles',
  'doubles',
  'triples',
  'hr',
  'rbi',
  'runs',
  'bb',
  'k',
  'sb',
  'cs',
  'outs',
] as const satisfies readonly (keyof CountingStats)[];

export const EMPTY_COUNTING_STATS: CountingStats = {
  singles: 0,
  doubles: 0,
  triples: 0,
  hr: 0,
  rbi: 0,
  runs: 0,
  bb: 0,
  k: 0,
  sb: 0,
  cs: 0,
  outs: 0,
};

export function hits(s: CountingStats): number {
  return s.singles + s.doubles + s.triples + s.hr;
}

// Strikeouts are recorded separately from other outs, so both count
// toward at-bats; walks do not.
export function atBats(s: CountingStats): number {
  return hits(s) + s.outs + s.k;
}

export function totalBases(s: CountingStats): number {
  return s.singles + 2 * s.doubles + 3 * s.triples + 4 * s.hr;
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function derive(s: CountingStats): DerivedStats {
  const h = hits(s);
  const ab = atBats(s);
  const tb = totalBases(s);
  const avg = ratio(h, ab);
  const obp = ratio(h + s.bb, ab + s.bb);
  const slg = ratio(tb, ab);
  return { hits: h, atBats: ab, totalBases: tb, avg, obp, slg, ops: obp + slg };
}

export function sumCountingStats(lines: CountingStats[]): CountingStats {
  const total = { ...EMPTY_COUNTING_STATS };
  for (const line of lines) {
    for (const key of COUNTING_STAT_KEYS) {
      total[key] += line[key];
    }
  }
  return total;
}

export function isEmptyLine(s: CountingStats): boolean {
  return COUNTING_STAT_KEYS.every((key) => s[key] === 0);
}

/** Format a rate stat the baseball way: .333, 1.000 */
export function formatRate(value: number): string {
  const fixed = value.toFixed(3);
  return value < 1 ? fixed.replace(/^0/, '') : fixed;
}
