"use server";

import { createClient } from "@/lib/supabase/server";
import { Team, TeamInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getTeam(): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching team:", error);
    return null;
  }

  return data;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching team by id:", error);
    return null;
  }

  return data;
}

export async function createTeam(input: TeamInput): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating team:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateTeam(id: string, input: TeamInput): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating team:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteTeam(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting team:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
