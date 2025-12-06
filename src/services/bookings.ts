import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;

export type BookingWithRoom = Booking & {
  rooms: { name: string } | null;
};

export async function fetchBookings(roomId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId);
  if (error) throw error;
  return data;
}

export async function fetchUserBookings(userId: string): Promise<BookingWithRoom[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(name)")
    .eq("user_id", userId)
    .order("start_time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createBooking(booking: BookingInsert): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}
