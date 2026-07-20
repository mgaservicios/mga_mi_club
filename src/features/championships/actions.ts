"use server";

import { createClient } from "@/lib/supabase/server";
import { Championship, ChampionshipInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getChampionships(teamId: string): Promise<Championship[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("championships")
    .select("*")
    .eq("team_id", teamId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching championships:", error);
    return [];
  }

  return data || [];
}

export async function getChampionshipById(id: string): Promise<Championship | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("championships")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching championship by id:", error);
    return null;
  }

  return data;
}

export async function createChampionship(input: ChampionshipInput): Promise<Championship | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("championships")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating championship:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateChampionship(id: string, input: ChampionshipInput): Promise<Championship | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("championships")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating championship:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteChampionship(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("championships")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting championship:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
