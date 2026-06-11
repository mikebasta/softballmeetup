import { CountingStats } from './stats';

export interface Player {
  id: string;
  name: string;
  nickname: string | null;
  is_active: boolean;
}

export interface Game {
  id: string;
  game_number: number;
  played_on: string;
  location: string;
  notes: string;
}

export interface StatLine extends CountingStats {
  id: string;
  game_id: string;
  player_id: string;
}
