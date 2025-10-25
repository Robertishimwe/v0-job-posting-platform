-- Drop existing policies
drop policy if exists "Admins can insert jobs" on public.jobs;
drop policy if exists "Admins can update jobs" on public.jobs;
drop policy if exists "Admins can delete jobs" on public.jobs;

-- Recreate policies with proper with check clauses
create policy "Admins can insert jobs"
  on public.jobs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Added with check clause to allow updates to proceed
create policy "Admins can update jobs"
  on public.jobs for update
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can delete jobs"
  on public.jobs for delete
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Allow admins to view all jobs (not just active ones)
drop policy if exists "Anyone can view active jobs" on public.jobs;

create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'active');

create policy "Admins can view all jobs"
  on public.jobs for select
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );
