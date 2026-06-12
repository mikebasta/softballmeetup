'use client';

import { useTransition } from 'react';
import { setPlayerActive } from './actions';

export default function PlayerActiveToggle({
  playerId,
  isActive,
}: {
  playerId: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(() => setPlayerActive(playerId, !isActive))
      }
      className="text-sm text-green-800 hover:underline disabled:opacity-50"
    >
      {isActive ? 'Deactivate' : 'Reactivate'}
    </button>
  );
}
