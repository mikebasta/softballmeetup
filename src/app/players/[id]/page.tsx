import { notFound } from 'next/navigation';
import StatLineTable from '@/components/StatLineTable';
import { getGames, getPlayer, getStatLinesForPlayer } from '@/lib/queries';
import { derive, formatRate, sumCountingStats } from '@/lib/stats';

export const dynamic = 'force-dynamic';

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, games, lines] = await Promise.all([
    getPlayer(id),
    getGames(),
    getStatLinesForPlayer(id),
  ]);
  if (!player) notFound();

  const gameById = new Map(games.map((g) => [g.id, g]));
  const rows = lines
    .map((line) => {
      const game = gameById.get(line.game_id);
      return {
        key: line.game_id,
        label: game ? `#${game.game_number} — ${game.played_on}` : 'Unknown game',
        href: `/games/${line.game_id}`,
        gameNumber: game?.game_number ?? 0,
        line,
      };
    })
    .sort((a, b) => b.gameNumber - a.gameNumber);

  const totals = derive(sumCountingStats(lines));

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {player.name}
        {player.nickname && (
          <span className="ml-2 text-lg font-normal text-gray-500">
            “{player.nickname}”
          </span>
        )}
      </h1>
      <p className="mb-6 mt-1 text-gray-600">
        {lines.length} games — {formatRate(totals.avg)} AVG /{' '}
        {formatRate(totals.obp)} OBP / {formatRate(totals.slg)} SLG /{' '}
        {formatRate(totals.ops)} OPS
      </p>
      <StatLineTable rows={rows} labelHeader="Game" footerLabel="Career" />
    </div>
  );
}
