-- Add user_id column to applications table to link applications to authenticated users
ALTER TABLE public.applications
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX idx_applications_user_id ON public.applications(user_id);

-- Update RLS policy to allow users to view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert applications with their own user_id
CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
