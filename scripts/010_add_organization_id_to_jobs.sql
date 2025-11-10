-- Add organization_id to jobs table
alter table public.jobs add column organization_id uuid references public.organizations(id) on delete cascade;

-- Create index for better performance
create index if not exists idx_jobs_organization_id on public.jobs(organization_id);

-- Update RLS policies for jobs
drop policy if exists "Admins can insert jobs" on public.jobs;
drop policy if exists "Admins can update jobs" on public.jobs;
drop policy if exists "Admins can delete jobs" on public.jobs;

-- Organizations can insert their own jobs
create policy "Organizations can insert jobs"
  on public.jobs for insert
  with check (organization_id = auth.uid()::uuid);

-- Organizations can update their own jobs
create policy "Organizations can update own jobs"
  on public.jobs for update
  using (organization_id = auth.uid()::uuid);

-- Organizations can delete their own jobs
create policy "Organizations can delete own jobs"
  on public.jobs for delete
  using (organization_id = auth.uid()::uuid);
