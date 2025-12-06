import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Room = Tables<"rooms">;
export type RoomInsert = TablesInsert<"rooms">;
export type RoomUpdate = TablesUpdate<"rooms">;

export async function fetchRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) throw error;
  return data;
}

export async function fetchRoom(id: string): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Room not found");
  return data;
}

export async function fetchUserRooms(userId: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function createRoom(room: RoomInsert): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .insert(room)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRoom(id: string, updates: RoomUpdate): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw error;
}
