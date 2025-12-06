-- Create site_settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('contact_email', 'info@elevatefinconsult.com', 'Main contact email displayed in footer'),
  ('contact_phone', '+250 XXX XXX XXX', 'Contact phone number displayed in footer'),
  ('contact_location', 'Kigali, Rwanda', 'Office location displayed in footer'),
  ('consulting_website_url', 'https://www.elevatefinconsult.com', 'Link to consulting services website')
ON CONFLICT (key) DO NOTHING;

-- Disable RLS for site_settings (public read, admin write)
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
