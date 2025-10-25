-- Add resume_url column to applications table
alter table public.applications
add column resume_url text;

-- Add comment to explain the column
comment on column public.applications.resume_url is 'URL to the uploaded resume PDF stored in Vercel Blob';
