import Link from 'next/link';
import { getGames, getPlayers } from '@/lib/queries';
import { addPlayer, createGame } from './actions';
import PlayerActiveToggle from './PlayerActiveToggle';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [games, players] = await Promise.all([getGames(), getPlayers()]);
  const nextGameNumber = (games[0]?.game_number ?? 0) + 1;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <section>
        <h2 className="mb-4 text-xl font-semibold">New game</h2>
        <form action={createGame} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Game #</span>
            <input
              type="number"
              name="game_number"
              required
              defaultValue={nextGameNumber}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Date</span>
            <input
              type="date"
              name="played_on"
              required
              defaultValue={today}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Location</span>
            <input
              type="text"
              name="location"
              placeholder="Westlake"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Notes</span>
            <input
              type="text"
              name="notes"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <button className="rounded bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-700">
            Create game & enter stats
          </button>
        </form>

        <h2 className="mb-4 mt-10 text-xl font-semibold">Games</h2>
        {games.length === 0 ? (
          <p className="text-gray-500">No games yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {games.map((game) => (
              <li key={game.id} className="flex justify-between py-2">
                <span>
                  #{game.game_number} — {game.played_on}
                  {game.location && ` at ${game.location}`}
                </span>
                <Link
                  href={`/admin/games/${game.id}`}
                  className="text-green-800 hover:underline"
                >
                  Enter stats
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Roster</h2>
        <form action={addPlayer} className="mb-4 flex gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="New player name"
            className="flex-1 rounded border border-gray-300 px-3 py-2"
          />
          <button className="rounded bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-700">
            Add
          </button>
        </form>
        <ul className="divide-y divide-gray-200">
          {players.map((player) => (
            <li key={player.id} className="flex items-center justify-between py-2">
              <span className={player.is_active ? '' : 'text-gray-400 line-through'}>
                {player.name}
              </span>
              <PlayerActiveToggle
                playerId={player.id}
                isActive={player.is_active}
              />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          Inactive players keep their stats but are hidden from the stat
          entry grid.
        </p>
      </section>
    </div>
  );
}
