-- Create organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null unique,
  password_hash text not null,
  status text default 'active', -- active, suspended
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;

-- Organizations can view their own profile
create policy "Organizations can view own profile"
  on public.organizations for select
  using (auth.uid()::text = id::text);
