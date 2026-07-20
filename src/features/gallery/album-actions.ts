"use server";

import { createClient } from "@/lib/supabase/server";
import { Album, AlbumInput } from "./album-types";
import { revalidatePath } from "next/cache";

export async function getAlbums(teamId: string): Promise<Album[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching albums:", error);
    return [];
  }

  return data || [];
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching album by id:", error);
    return null;
  }

  return data;
}

export async function createAlbum(input: AlbumInput): Promise<Album | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating album:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateAlbum(id: string, input: AlbumInput): Promise<Album | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating album:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting album:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
