create extension if not exists "uuid-ossp";

create table if not exists students (
  reg_no text primary key,
  name text not null,
  pin_hash text not null,
  class_name text not null,
  active boolean not null default true,
  failed_attempts integer not null default 0,
  locked_until timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists folders (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  class_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists worksheets (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid references folders(id) on delete cascade,
  title text not null,
  class_name text not null,
  pdf_url text not null,
  type text not null,
  published_at timestamptz null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  worksheet_id uuid references worksheets(id) on delete cascade,
  prompt text not null,
  field_type text not null,
  required boolean not null default false,
  order_index integer not null default 0
);

create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  worksheet_id uuid references worksheets(id) on delete cascade,
  student_reg_no text references students(reg_no) on delete cascade,
  status text not null check (status in ('DRAFT', 'SUBMITTED')),
  answers_json jsonb,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz null,
  generated_pdf_url text null
);

create index if not exists idx_students_class on students(class_name);
create index if not exists idx_worksheets_folder on worksheets(folder_id);
create index if not exists idx_tasks_worksheet on tasks(worksheet_id);
create index if not exists idx_submissions_student on submissions(student_reg_no);
create index if not exists idx_submissions_worksheet on submissions(worksheet_id);
