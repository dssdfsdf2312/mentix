-- Admin settings table (stores admin password)
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID REFERENCES availability_slots(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_message TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'confirmed',
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  zoom_start_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_slots_date ON availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_slots_booked ON availability_slots(is_booked);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);

-- Seed admin password (default: "admin123" - change this!)
INSERT INTO admin_settings (key, value)
VALUES ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;
