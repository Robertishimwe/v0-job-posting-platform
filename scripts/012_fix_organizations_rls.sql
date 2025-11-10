-- Drop existing policy that's preventing inserts
drop policy if exists "Organizations can view own profile" on public.organizations;

-- Policy to allow authenticated users to insert their own organization
create policy "Organizations can insert their own record"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- Policy to allow organizations to view their own profile
create policy "Organizations can view own profile"
  on public.organizations for select
  using (auth.uid()::text = id::text);

-- Policy to allow organizations to update their own record
create policy "Organizations can update own record"
  on public.organizations for update
  using (auth.uid()::text = id::text)
  with check (auth.uid()::text = id::text);
