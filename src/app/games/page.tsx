import Link from 'next/link';
import { getGames } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Games</h1>
      {games.length === 0 ? (
        <p className="text-gray-500">No games recorded yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-green-800 text-left">
              <th className="px-2 py-2">Game</th>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Location</th>
              <th className="px-2 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b border-gray-200 hover:bg-green-50">
                <td className="px-2 py-1.5">
                  <Link
                    href={`/games/${game.id}`}
                    className="font-medium text-green-800 hover:underline"
                  >
                    #{game.game_number}
                  </Link>
                </td>
                <td className="px-2 py-1.5">{game.played_on}</td>
                <td className="px-2 py-1.5">{game.location}</td>
                <td className="px-2 py-1.5 text-gray-600">{game.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
