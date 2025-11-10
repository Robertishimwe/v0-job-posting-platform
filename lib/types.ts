export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string
  responsibilities: string
  salary_range: string | null
  posted_date: string
  deadline: string | null
  status: string
  organization_id?: string | null
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string
  cover_letter: string | null
  resume_url: string | null
  status: "pending" | "shortlisted" | "rejected"
  applied_at: string
  created_at: string
  updated_at: string
}

export interface ApplicationWithJob extends Application {
  jobs: Job
}

export interface Organization {
  id: string
  company_name: string
  contact_person: string
  email: string
  status: string
  created_at: string
  updated_at: string
}
