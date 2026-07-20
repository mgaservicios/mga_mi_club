"use server";

import { createClient } from "@/lib/supabase/server";
import { Rival, RivalInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getRivals(teamId: string): Promise<Rival[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rivals")
    .select("*")
    .eq("team_id", teamId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching rivals:", error);
    return [];
  }

  return data || [];
}

export async function createRival(input: RivalInput): Promise<Rival | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rivals")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating rival:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateRival(id: string, input: RivalInput): Promise<Rival | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rivals")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating rival:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteRival(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("rivals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting rival:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
