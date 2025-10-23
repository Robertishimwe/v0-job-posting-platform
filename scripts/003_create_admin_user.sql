-- Create an admin user
-- First, you need to sign up this user through Supabase Auth
-- This script will link the auth user to the admin_users table

-- Insert admin user (replace with actual user ID after signup)
-- To use this: 
-- 1. First sign up at /admin/login with email: admin@elevatefin.com
-- 2. Get the user ID from Supabase Auth dashboard
-- 3. Run this script with the actual user ID

-- For now, we'll create a function to automatically add admin users
create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  -- Only add to admin_users if email matches admin pattern
  if new.email = 'admin@elevatefin.com' or new.email like '%@elevatefin.com' then
    insert into public.admin_users (id, email, full_name, role)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'admin');
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically add admin users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin_user();

-- Note: To create your first admin, sign up with email ending in @elevatefin.com
-- Example: admin@elevatefin.com, hr@elevatefin.com, etc.
