import StatsTable from '@/components/StatsTable';
import { buildPlayerTotals } from '@/lib/leaderboard';
import { getAllStatLines, getPlayers } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const [players, lines] = await Promise.all([getPlayers(), getAllStatLines()]);
  const rows = buildPlayerTotals(players, lines).filter(
    (row) => row.games > 0,
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Player stats</h1>
      <StatsTable rows={rows} />
    </div>
  );
}
