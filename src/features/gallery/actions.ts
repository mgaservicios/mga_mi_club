"use server";

import { createClient } from "@/lib/supabase/server";
import { GalleryImage, GalleryInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getGallery(teamId: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("team_id", teamId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }

  return data || [];
}

export async function getGalleryByAlbum(teamId: string, albumId: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("team_id", teamId)
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching gallery by album:", error);
    return [];
  }

  return data || [];
}

export async function createGalleryImage(input: GalleryInput): Promise<GalleryImage | null> {
  const supabase = await createClient();

  // Intentar insertar con todos los campos
  const { data, error } = await supabase
    .from("gallery")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.warn("Error creating gallery image with all fields, trying fallback:", error.message);

    // Fallback: remover columnas nuevas si falla
    const { album_id, photo_date, location, ...fallbackInput } = input;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("gallery")
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

export async function updateGalleryImage(id: string, input: GalleryInput): Promise<GalleryImage | null> {
  const supabase = await createClient();

  // Intentar actualizar con todos los campos
  const { data, error } = await supabase
    .from("gallery")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.warn("Error updating gallery image with all fields, trying fallback:", error.message);

    // Fallback: remover columnas nuevas si falla
    const { album_id, photo_date, location, ...fallbackInput } = input;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("gallery")
      .update(fallbackInput)
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

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
