"use server";

import { createClient } from "@/lib/supabase/server";
import { Standing, StandingInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getStandings(teamId: string): Promise<Standing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("standings")
    .select("*")
    .eq("team_id", teamId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching standings:", error);
    return [];
  }

  return data || [];
}

export async function getStandingById(id: string): Promise<Standing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("standings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching standing by id:", error);
    return null;
  }

  return data;
}

export async function createStanding(input: StandingInput): Promise<Standing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("standings")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating standing:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateStanding(id: string, input: StandingInput): Promise<Standing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("standings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating standing:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteStanding(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("standings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting standing:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
