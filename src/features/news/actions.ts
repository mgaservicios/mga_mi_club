"use server";

import { createClient } from "@/lib/supabase/server";
import { News, NewsInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getPublishedNews(teamId: string): Promise<News[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("team_id", teamId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published news:", error);
    return [];
  }

  return data || [];
}

export async function getAllNews(teamId: string): Promise<News[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all news:", error);
    return [];
  }

  return data || [];
}

export async function getNewsById(id: string): Promise<News | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }

  return data;
}

export async function createNews(input: NewsInput): Promise<News | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating news:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function updateNews(id: string, input: NewsInput): Promise<News | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating news:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteNews(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting news:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
