import { notFound } from 'next/navigation';
import StatLineTable from '@/components/StatLineTable';
import { getGame, getPlayers, getStatLinesForGame } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [game, players, lines] = await Promise.all([
    getGame(id),
    getPlayers(),
    getStatLinesForGame(id),
  ]);
  if (!game) notFound();

  const nameById = new Map(players.map((p) => [p.id, p.name]));
  const rows = lines
    .map((line) => ({
      key: line.player_id,
      label: nameById.get(line.player_id) ?? 'Unknown',
      href: `/players/${line.player_id}`,
      line,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      <h1 className="text-2xl font-bold">Game #{game.game_number}</h1>
      <p className="mb-6 mt-1 text-gray-600">
        {game.played_on}
        {game.location && ` at ${game.location}`}
        {game.notes && ` — ${game.notes}`}
      </p>
      <StatLineTable rows={rows} labelHeader="Player" footerLabel="Team" />
    </div>
  );
}
