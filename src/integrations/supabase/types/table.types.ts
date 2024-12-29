import type { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Room = Tables<'rooms'>;
export type Profile = Tables<'profiles'>;
export type Booking = Tables<'bookings'>;