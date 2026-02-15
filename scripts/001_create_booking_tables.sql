-- Availability slots table
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes: 30, 60, or 90
  is_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES public.availability_slots(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_message TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'rescheduled')),
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  zoom_start_url TEXT,
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin settings table (for password, zoom config, etc.)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disable RLS since this is an admin-only app with password protection
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public can read available slots
CREATE POLICY "Anyone can view available slots" ON public.availability_slots
  FOR SELECT USING (true);

-- Public can read bookings (needed for booking flow)
CREATE POLICY "Anyone can view bookings" ON public.bookings
  FOR SELECT USING (true);

-- Allow inserts from service role and anon for booking creation
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Allow updates for bookings
CREATE POLICY "Anyone can update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- Allow all operations on availability_slots for management
CREATE POLICY "Anyone can insert slots" ON public.availability_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update slots" ON public.availability_slots
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete slots" ON public.availability_slots
  FOR DELETE USING (true);

-- Admin settings: read and write
CREATE POLICY "Anyone can read settings" ON public.admin_settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert settings" ON public.admin_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update settings" ON public.admin_settings
  FOR UPDATE USING (true);

-- Insert default admin password (change this!)
INSERT INTO public.admin_settings (key, value)
VALUES ('admin_password', 'mentix2024')
ON CONFLICT (key) DO NOTHING;

-- Create index for faster slot lookups
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON public.availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON public.bookings(slot_id);
