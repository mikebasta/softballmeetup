import { describe, expect, it } from 'vitest';
import {
  CountingStats,
  EMPTY_COUNTING_STATS,
  atBats,
  derive,
  formatRate,
  hits,
  isEmptyLine,
  sumCountingStats,
  totalBases,
} from './stats';

const line = (overrides: Partial<CountingStats>): CountingStats => ({
  ...EMPTY_COUNTING_STATS,
  ...overrides,
});

describe('hits / atBats / totalBases', () => {
  it('sums hit types', () => {
    expect(hits(line({ singles: 2, doubles: 1, triples: 1, hr: 1 }))).toBe(5);
  });

  it('counts outs and strikeouts as at-bats, but not walks', () => {
    expect(atBats(line({ singles: 1, outs: 2, k: 1, bb: 3 }))).toBe(4);
  });

  it('weights total bases', () => {
    expect(totalBases(line({ singles: 1, doubles: 1, triples: 1, hr: 1 }))).toBe(10);
  });
});

describe('derive', () => {
  it('computes a perfect game', () => {
    const d = derive(line({ singles: 3, hr: 1 }));
    expect(d.avg).toBe(1);
    expect(d.obp).toBe(1);
    expect(d.slg).toBe(1.75); // 7 TB / 4 AB
    expect(d.ops).toBe(2.75);
  });

  it('computes a mixed line', () => {
    // 2 H in 4 AB, 1 BB
    const d = derive(line({ singles: 1, doubles: 1, outs: 1, k: 1, bb: 1 }));
    expect(d.hits).toBe(2);
    expect(d.atBats).toBe(4);
    expect(d.avg).toBe(0.5);
    expect(d.obp).toBe(0.6); // (2+1)/(4+1)
    expect(d.slg).toBe(0.75); // 3 TB / 4 AB
    expect(d.ops).toBe(1.35);
  });

  it('returns zeros instead of dividing by zero', () => {
    const d = derive(EMPTY_COUNTING_STATS);
    expect(d.avg).toBe(0);
    expect(d.obp).toBe(0);
    expect(d.slg).toBe(0);
    expect(d.ops).toBe(0);
  });

  it('handles walks-only lines (no at-bats)', () => {
    const d = derive(line({ bb: 2 }));
    expect(d.atBats).toBe(0);
    expect(d.avg).toBe(0);
    expect(d.obp).toBe(1); // (0+2)/(0+2)
  });
});

describe('sumCountingStats', () => {
  it('aggregates multiple game lines', () => {
    const total = sumCountingStats([
      line({ singles: 2, rbi: 3, outs: 1 }),
      line({ doubles: 1, rbi: 1, sb: 2 }),
    ]);
    expect(total).toEqual(
      line({ singles: 2, doubles: 1, rbi: 4, outs: 1, sb: 2 }),
    );
  });

  it('returns an empty line for no input', () => {
    expect(sumCountingStats([])).toEqual(EMPTY_COUNTING_STATS);
  });
});

describe('isEmptyLine', () => {
  it('is true for all zeros', () => {
    expect(isEmptyLine(EMPTY_COUNTING_STATS)).toBe(true);
  });

  it('is false when any stat is set', () => {
    expect(isEmptyLine(line({ cs: 1 }))).toBe(false);
  });
});

describe('formatRate', () => {
  it('drops the leading zero below 1', () => {
    expect(formatRate(1 / 3)).toBe('.333');
  });

  it('keeps the leading digit at or above 1', () => {
    expect(formatRate(1)).toBe('1.000');
    expect(formatRate(1.351)).toBe('1.351');
  });

  it('formats zero', () => {
    expect(formatRate(0)).toBe('.000');
  });
});
