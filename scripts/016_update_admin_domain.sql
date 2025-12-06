-- Update admin user check to use new domain
-- This script updates the admin creation trigger to use the correct domain

-- Drop the old trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_admin_user();

-- Create updated function with correct domain
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email ends with @elevatefinconsult.com (updated domain)
  IF NEW.email LIKE '%@elevatefinconsult.com' THEN
    INSERT INTO public.admin_users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Note: Existing admins remain valid. New admins must use @elevatefinconsult.com email
