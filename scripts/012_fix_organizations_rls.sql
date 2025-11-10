-- Drop existing policies
drop policy if exists "Organizations can insert their own record" on public.organizations;
drop policy if exists "Organizations can view own profile" on public.organizations;
drop policy if exists "Organizations can update own record" on public.organizations;

-- Allow any authenticated user to insert an organization
create policy "organizations_insert_authenticated"
  on public.organizations for insert
  with check (true);

-- Allow unauthenticated and authenticated users to view organizations (needed for login)
create policy "organizations_select_all"
  on public.organizations for select
  using (true);

-- Policy to allow organizations to update their own record
create policy "Organizations can update own record"
  on public.organizations for update
  using (auth.uid()::text = id::text)
  with check (auth.uid()::text = id::text);
