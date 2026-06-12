import { notFound } from 'next/navigation';
import { getGame, getPlayers, getStatLinesForGame } from '@/lib/queries';
import StatEntryGrid from './StatEntryGrid';

export const dynamic = 'force-dynamic';

export default async function AdminGamePage({
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

  // Show active players, plus anyone who already has a line for this
  // game (e.g. recorded before being deactivated).
  const playerIdsWithLines = new Set(lines.map((line) => line.player_id));
  const gridPlayers = players.filter(
    (p) => p.is_active || playerIdsWithLines.has(p.id),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Stats for game #{game.game_number}
      </h1>
      <p className="mb-6 mt-1 text-gray-600">
        {game.played_on}
        {game.location && ` at ${game.location}`}
      </p>
      <StatEntryGrid gameId={game.id} players={gridPlayers} lines={lines} />
    </div>
  );
}
