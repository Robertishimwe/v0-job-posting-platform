-- Add organization_id to applications via job
-- Update RLS to allow organizations to view applications for their jobs
drop policy if exists "Admins can view all applications" on public.applications;
drop policy if exists "Admins can update applications" on public.applications;

-- Organizations can view applications for their jobs
create policy "Organizations can view own applications"
  on public.applications for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.organization_id = auth.uid()::uuid
    )
  );

-- Organizations can update applications for their jobs
create policy "Organizations can update own applications"
  on public.applications for update
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.organization_id = auth.uid()::uuid
    )
  );

-- Users can view their own applications
create policy "Users can view own applications"
  on public.applications for select
  using (user_id = auth.uid()::uuid);
