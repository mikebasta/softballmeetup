import {
  CountingStats,
  DerivedStats,
  derive,
  sumCountingStats,
} from './stats';
import { Player, StatLine } from './types';

export interface PlayerTotalsRow extends CountingStats, DerivedStats {
  playerId: string;
  name: string;
  games: number;
}

/** Aggregate every player's stat lines into one sortable row per player. */
export function buildPlayerTotals(
  players: Player[],
  lines: StatLine[],
): PlayerTotalsRow[] {
  const byPlayer = new Map<string, StatLine[]>();
  for (const line of lines) {
    const list = byPlayer.get(line.player_id) ?? [];
    list.push(line);
    byPlayer.set(line.player_id, list);
  }

  return players.map((player) => {
    const playerLines = byPlayer.get(player.id) ?? [];
    const totals = sumCountingStats(playerLines);
    return {
      playerId: player.id,
      name: player.name,
      games: playerLines.length,
      ...totals,
      ...derive(totals),
    };
  });
}
