'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CountingStats, isEmptyLine } from '@/lib/stats';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function createGame(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('games')
    .insert({
      game_number: Number(formData.get('game_number')),
      played_on: String(formData.get('played_on')),
      location: String(formData.get('location') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    })
    .select('id')
    .single();
  if (error) throw new Error(`Could not create game: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/games');
  redirect(`/admin/games/${data.id}`);
}

export async function addPlayer(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;

  const supabase = await createClient();
  const { error } = await supabase.from('players').insert({ name });
  if (error) throw new Error(`Could not add player: ${error.message}`);

  revalidatePath('/admin');
  revalidatePath('/stats');
}

export async function setPlayerActive(playerId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('players')
    .update({ is_active: isActive })
    .eq('id', playerId);
  if (error) throw new Error(`Could not update player: ${error.message}`);

  revalidatePath('/admin');
}

export interface StatLineEntry extends CountingStats {
  player_id: string;
}

export async function saveStatLines(gameId: string, entries: StatLineEntry[]) {
  const supabase = await createClient();

  const filled = entries
    .filter((entry) => !isEmptyLine(entry))
    .map((entry) => ({ ...entry, game_id: gameId }));
  const emptyPlayerIds = entries
    .filter((entry) => isEmptyLine(entry))
    .map((entry) => entry.player_id);

  if (filled.length > 0) {
    const { error } = await supabase
      .from('stat_lines')
      .upsert(filled, { onConflict: 'game_id,player_id' });
    if (error) throw new Error(`Could not save stats: ${error.message}`);
  }

  // A line zeroed out in the grid means "this player has no stats for
  // this game" — remove any previously saved row.
  if (emptyPlayerIds.length > 0) {
    const { error } = await supabase
      .from('stat_lines')
      .delete()
      .eq('game_id', gameId)
      .in('player_id', emptyPlayerIds);
    if (error) throw new Error(`Could not clear stats: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/stats');
  revalidatePath(`/games/${gameId}`);
}
