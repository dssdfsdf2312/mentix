-- Add meeting_platform column to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS meeting_platform text DEFAULT 'zoom',
ADD COLUMN IF NOT EXISTS google_meet_url text;

-- Add platform enable/disable settings
INSERT INTO admin_settings (key, value)
VALUES
  ('zoom_enabled', 'true'),
  ('google_meet_enabled', 'true')
ON CONFLICT (key) DO NOTHING;
