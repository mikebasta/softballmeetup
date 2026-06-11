import Link from 'next/link';
import { buildPlayerTotals } from '@/lib/leaderboard';
import { getAllStatLines, getGames, getPlayers } from '@/lib/queries';
import { formatRate } from '@/lib/stats';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [players, games, lines] = await Promise.all([
    getPlayers(),
    getGames(),
    getAllStatLines(),
  ]);

  const recentGames = games.slice(0, 5);
  const leaders = buildPlayerTotals(players, lines)
    .filter((row) => row.atBats > 0)
    .sort((a, b) => b.ops - a.ops)
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">San Francisco Softball Meetup</h1>
        <p className="mt-2 text-gray-600">
          Stats and box scores from our weekly pickup games.{' '}
          <a
            href="https://www.meetup.com/san-francisco-softball-players/"
            className="text-green-800 underline"
          >
            Join us on Meetup
          </a>
          .
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Recent games</h2>
          <Link href="/games" className="text-sm text-green-800 hover:underline">
            All games →
          </Link>
        </div>
        {recentGames.length === 0 ? (
          <p className="mt-3 text-gray-500">No games recorded yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-200">
            {recentGames.map((game) => (
              <li key={game.id} className="py-2">
                <Link
                  href={`/games/${game.id}`}
                  className="text-green-800 hover:underline"
                >
                  Game #{game.game_number}
                </Link>{' '}
                <span className="text-gray-600">
                  — {game.played_on}
                  {game.location && ` at ${game.location}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">OPS leaders</h2>
          <Link href="/stats" className="text-sm text-green-800 hover:underline">
            Full stats →
          </Link>
        </div>
        {leaders.length === 0 ? (
          <p className="mt-3 text-gray-500">No stats recorded yet.</p>
        ) : (
          <ol className="mt-3 divide-y divide-gray-200">
            {leaders.map((row, i) => (
              <li key={row.playerId} className="flex justify-between py-2">
                <span>
                  {i + 1}.{' '}
                  <Link
                    href={`/players/${row.playerId}`}
                    className="text-green-800 hover:underline"
                  >
                    {row.name}
                  </Link>
                </span>
                <span className="font-mono">{formatRate(row.ops)} OPS</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
