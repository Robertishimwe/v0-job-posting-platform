-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  location text not null,
  type text not null, -- Full-time, Part-time, Contract
  description text not null,
  requirements text not null,
  responsibilities text not null,
  salary_range text,
  posted_date timestamptz default now(),
  deadline timestamptz,
  status text default 'active', -- active, closed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  cover_letter text,
  resume_url text,
  status text default 'pending', -- pending, shortlisted, rejected
  applied_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create admin_users table for authentication
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.admin_users enable row level security;

-- Jobs policies (public can read active jobs, only admins can modify)
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'active');

create policy "Admins can insert jobs"
  on public.jobs for insert
  with check (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can update jobs"
  on public.jobs for update
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can delete jobs"
  on public.jobs for delete
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Applications policies (anyone can insert, only admins can view/update)
create policy "Anyone can submit applications"
  on public.applications for insert
  with check (true);

create policy "Admins can view all applications"
  on public.applications for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can update applications"
  on public.applications for update
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Admin users policies
create policy "Admins can view admin users"
  on public.admin_users for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_posted_date on public.jobs(posted_date desc);
create index if not exists idx_applications_job_id on public.applications(job_id);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_applied_at on public.applications(applied_at desc);
