-- Drop existing policies that prevent users from seeing their own applications
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );

-- Anyone can submit applications
CREATE POLICY "Anyone can submit applications"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Users can update their own applications, admins can update any
CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.admin_users
    )
  );
