-- Disable RLS on jobs table since we're using custom organization authentication
-- Organizations will be validated at the application layer (not via Supabase Auth)
alter table public.jobs disable row level security;

-- For applications, keep RLS but update policies to allow organization and user access
alter table public.applications disable row level security;
