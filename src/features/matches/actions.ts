"use server";

import { createClient } from "@/lib/supabase/server";
import { Match, MatchInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getMatches(teamId: string): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("team_id", teamId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching matches:", error);
    return [];
  }

  return data || [];
}

export async function getMatchById(id: string): Promise<Match | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching match by id:", error);
    return null;
  }

  return data;
}

export async function createMatch(input: MatchInput): Promise<Match | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating match:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateMatch(id: string, input: MatchInput): Promise<Match | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating match:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteMatch(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting match:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}

export async function getNextMatch(teamId: string): Promise<Match | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_next_match", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching next match:", error);
    return null;
  }

  return data;
}

export async function setNextMatch(teamId: string, matchId: string): Promise<boolean> {
  const supabase = await createClient();

  // Desactivar todos los partidos como "próximo partido" para este equipo
  const { error: deactivateError } = await supabase
    .from("matches")
    .update({ is_next_match: false })
    .eq("team_id", teamId);

  if (deactivateError) {
    console.error("Error deactivating next matches:", deactivateError);
    throw new Error(deactivateError.message);
  }

  // Activar el partido seleccionado
  const { error: activateError } = await supabase
    .from("matches")
    .update({ is_next_match: true })
    .eq("id", matchId);

  if (activateError) {
    console.error("Error activating next match:", activateError);
    throw new Error(activateError.message);
  }

  revalidatePath("/");
  return true;
}

export async function unsetNextMatch(matchId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("matches")
    .update({ is_next_match: false })
    .eq("id", matchId);

  if (error) {
    console.error("Error unsetting next match:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
