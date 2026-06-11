'use client';

import { useState, useTransition } from 'react';
import {
  COUNTING_STAT_KEYS,
  CountingStats,
  EMPTY_COUNTING_STATS,
  derive,
  formatRate,
} from '@/lib/stats';
import { Player, StatLine } from '@/lib/types';
import { saveStatLines } from '../../actions';

const COLUMN_LABELS: Record<keyof CountingStats, string> = {
  singles: '1B',
  doubles: '2B',
  triples: '3B',
  hr: 'HR',
  rbi: 'RBI',
  runs: 'R',
  bb: 'BB',
  k: 'K',
  sb: 'SB',
  cs: 'CS',
  outs: 'Outs',
};

type Grid = Record<string, CountingStats>;

export default function StatEntryGrid({
  gameId,
  players,
  lines,
}: {
  gameId: string;
  players: Player[];
  lines: StatLine[];
}) {
  const [grid, setGrid] = useState<Grid>(() => {
    const byPlayer = new Map(lines.map((line) => [line.player_id, line]));
    return Object.fromEntries(
      players.map((player) => {
        const existing = byPlayer.get(player.id);
        const stats = { ...EMPTY_COUNTING_STATS };
        if (existing) {
          for (const key of COUNTING_STAT_KEYS) stats[key] = existing[key];
        }
        return [player.id, stats];
      }),
    );
  });
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCell = (playerId: string, key: keyof CountingStats, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const value = digits === '' ? 0 : Math.min(Number(digits), 99);
    setSaved(false);
    setGrid((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [key]: value },
    }));
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await saveStatLines(
          gameId,
          players.map((player) => ({
            player_id: player.id,
            ...grid[player.id],
          })),
        );
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed');
      }
    });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-green-800">
              <th className="whitespace-nowrap px-2 py-2 text-left">Player</th>
              {COUNTING_STAT_KEYS.map((key) => (
                <th key={key} className="px-1 py-2 text-center">
                  {COLUMN_LABELS[key]}
                </th>
              ))}
              <th className="px-2 py-2 text-center">AVG</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const stats = grid[player.id];
              return (
                <tr key={player.id} className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-2 py-1 font-medium">
                    {player.name}
                  </td>
                  {COUNTING_STAT_KEYS.map((key) => (
                    <td key={key} className="px-1 py-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={stats[key] === 0 ? '' : String(stats[key])}
                        placeholder="0"
                        onChange={(e) => setCell(player.id, key, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-11 rounded border border-gray-300 px-1 py-1 text-center focus:border-green-700 focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1 text-center font-mono text-gray-500">
                    {formatRate(derive(stats).avg)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={pending}
          className="rounded bg-green-800 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save stats'}
        </button>
        {saved && <span className="text-sm text-green-700">Saved ✓</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Players with all-zero rows are left out of the box score. Zeroing a
        previously saved row removes it.
      </p>
    </div>
  );
}
