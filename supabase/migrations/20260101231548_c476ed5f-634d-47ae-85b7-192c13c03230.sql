-- Allow anonymous users to view rooms
CREATE POLICY "Rooms are viewable by anonymous users" 
ON public.rooms 
FOR SELECT 
TO anon
USING (true);