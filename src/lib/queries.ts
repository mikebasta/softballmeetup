import { createClient } from './supabase/server';
import { Game, Player, StatLine } from './types';

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function getGames(): Promise<Game[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('game_number', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getGame(id: string): Promise<Game | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPlayer(id: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllStatLines(): Promise<StatLine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('stat_lines').select('*');
  if (error) throw error;
  return data;
}

export async function getStatLinesForGame(gameId: string): Promise<StatLine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stat_lines')
    .select('*')
    .eq('game_id', gameId);
  if (error) throw error;
  return data;
}

export async function getStatLinesForPlayer(
  playerId: string,
): Promise<StatLine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stat_lines')
    .select('*')
    .eq('player_id', playerId);
  if (error) throw error;
  return data;
}
