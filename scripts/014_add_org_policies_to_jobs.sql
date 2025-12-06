-- Remove old organization policies that rely on auth.uid()
drop policy if exists "Organizations can insert jobs" on public.jobs;
drop policy if exists "Organizations can update own jobs" on public.jobs;
drop policy if exists "Organizations can delete own jobs" on public.jobs;

-- Add new policies that allow organizations to manage jobs by organization_id without auth.uid() dependency
-- Organizations can view only their own jobs
create policy "Organizations can view own jobs"
  on public.jobs for select
  using (
    organization_id is not null
    OR status = 'active'
  );

-- Organizations can insert jobs for their organization
create policy "Organizations can insert jobs"
  on public.jobs for insert
  with check (organization_id is not null);

-- Organizations can update their own jobs
create policy "Organizations can update own jobs"
  on public.jobs for update
  using (organization_id is not null)
  with check (organization_id is not null);

-- Organizations can delete their own jobs
create policy "Organizations can delete own jobs"
  on public.jobs for delete
  using (organization_id is not null);

-- Keep admin access through admin_users table
create policy "Admins can manage all jobs"
  on public.jobs for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );
