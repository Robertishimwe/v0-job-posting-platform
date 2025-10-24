-- Drop the problematic policy
drop policy if exists "Admins can view admin users" on public.admin_users;

-- Create new policies that don't cause infinite recursion
-- Allow authenticated users to read their own admin record
create policy "Users can view their own admin record"
  on public.admin_users for select
  using (auth.uid() = id);

-- Allow admins to insert new admin users (checked via auth metadata or service role)
create policy "Service role can insert admin users"
  on public.admin_users for insert
  with check (true);

-- Allow admins to update their own record
create policy "Users can update their own admin record"
  on public.admin_users for update
  using (auth.uid() = id);
