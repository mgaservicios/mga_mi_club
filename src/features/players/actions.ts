"use server";

import { createClient } from "@/lib/supabase/server";
import { Player, PlayerInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getPlayers(teamId: string): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .order("role", { ascending: true })
    .order("number", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }

  return data || [];
}

export async function getPlayersByRole(teamId: string, role: string): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .eq("role", role)
    .order("number", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching players by role:", error);
    return [];
  }

  return data || [];
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching player by id:", error);
    return null;
  }

  return data;
}

export async function createPlayer(input: PlayerInput): Promise<Player | null> {
  const supabase = await createClient();

  // Intentar insertar con todos los campos
  const { data, error } = await supabase
    .from("players")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.warn("Error creating player with all fields, trying fallback:", error.message);

    // Fallback: remover columnas nuevas si falla
    const { birthplace, height_cm, previous_clubs, ...fallbackInput } = input;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("players")
      .insert([fallbackInput])
      .select()
      .single();

    if (fallbackError) {
      console.error("Fallback failed as well:", fallbackError);
      throw new Error(fallbackError.message);
    }

    revalidatePath("/");
    return fallbackData;
  }

  revalidatePath("/");
  return data;
}

export async function updatePlayer(id: string, input: PlayerInput): Promise<Player | null> {
  const supabase = await createClient();

  // Intentar actualizar con todos los campos
  const { data, error } = await supabase
    .from("players")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.warn("Error updating player with all fields, trying fallback:", error.message);

    // Fallback: remover columnas nuevas si falla
    const { birthplace, height_cm, previous_clubs, ...fallbackInput } = input;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("players")
      .update({ ...fallbackInput, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (fallbackError) {
      console.error("Fallback failed as well:", fallbackError);
      throw new Error(fallbackError.message);
    }

    revalidatePath("/");
    return fallbackData;
  }

  revalidatePath("/");
  return data;
}

export async function deletePlayer(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting player:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
