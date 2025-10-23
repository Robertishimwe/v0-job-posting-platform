-- Insert sample jobs
insert into public.jobs (title, department, location, type, description, requirements, responsibilities, salary_range, deadline)
values
  (
    'Senior Financial Analyst',
    'Finance',
    'Kigali, Rwanda',
    'Full-time',
    'We are seeking an experienced Senior Financial Analyst to join our growing team. This role will be instrumental in providing financial insights and strategic recommendations to drive business growth.',
    '• Bachelor''s degree in Finance, Accounting, or related field
• 5+ years of experience in financial analysis
• Strong proficiency in Excel and financial modeling
• CFA or CPA certification preferred
• Excellent analytical and problem-solving skills',
    '• Conduct comprehensive financial analysis and forecasting
• Prepare detailed financial reports and presentations
• Collaborate with cross-functional teams on strategic initiatives
• Monitor market trends and competitive landscape
• Support budgeting and planning processes',
    'RWF 8,000,000 - 12,000,000 per year',
    now() + interval '30 days'
  ),
  (
    'Junior Accountant',
    'Accounting',
    'Kigali, Rwanda',
    'Full-time',
    'Join our accounting team as a Junior Accountant and gain valuable experience in a dynamic consulting environment. This is an excellent opportunity for recent graduates or early-career professionals.',
    '• Bachelor''s degree in Accounting or Finance
• 1-2 years of experience (internships count)
• Knowledge of accounting principles and practices
• Proficiency in accounting software
• Strong attention to detail',
    '• Assist with day-to-day accounting operations
• Process invoices and expense reports
• Reconcile bank statements and accounts
• Support month-end and year-end closing processes
• Maintain accurate financial records',
    'RWF 3,500,000 - 5,000,000 per year',
    now() + interval '45 days'
  ),
  (
    'Business Consultant',
    'Consulting',
    'Kigali, Rwanda',
    'Full-time',
    'We are looking for a talented Business Consultant to help our clients solve complex business challenges and drive organizational transformation.',
    '• Bachelor''s degree in Business Administration or related field
• 3+ years of consulting experience
• Strong analytical and strategic thinking skills
• Excellent communication and presentation abilities
• Experience with project management',
    '• Lead client engagements and deliver strategic recommendations
• Conduct market research and competitive analysis
• Develop business cases and implementation roadmaps
• Facilitate workshops and stakeholder meetings
• Build and maintain strong client relationships',
    'RWF 6,000,000 - 10,000,000 per year',
    now() + interval '60 days'
  ),
  (
    'Data Analyst',
    'Analytics',
    'Kigali, Rwanda',
    'Full-time',
    'We are seeking a Data Analyst to transform data into actionable insights that drive business decisions. You will work with various stakeholders to understand their data needs and deliver impactful analysis.',
    '• Bachelor''s degree in Statistics, Mathematics, or related field
• 2+ years of experience in data analysis
• Proficiency in SQL, Python, or R
• Experience with data visualization tools (Tableau, Power BI)
• Strong statistical analysis skills',
    '• Analyze complex datasets to identify trends and patterns
• Create dashboards and reports for stakeholders
• Develop predictive models and forecasts
• Collaborate with teams to define KPIs and metrics
• Present findings to non-technical audiences',
    'RWF 5,000,000 - 8,000,000 per year',
    now() + interval '40 days'
  );
