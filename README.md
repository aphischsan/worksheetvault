# WorksheetVault

WorksheetVault is a Next.js web app for managing and completing PDF-based worksheets. It uses Supabase Postgres for storage and Supabase Storage for PDF uploads.

## Features

- Teacher admin access protected by a single `ADMIN_PASSWORD` environment variable.
- Student login with registration number + 4-digit PIN (PINs are hashed).
- Login lockout for 2 minutes after 5 failed attempts.
- Teacher workflows for students, folders, worksheets, tasks, publishing, and submissions.
- Student dashboard with latest, in-progress, and all worksheets.
- Worksheet answering view with PDF preview + autosaving answers.

## Supabase setup

1. Create a new Supabase project.
2. Run the SQL migration in `supabase/migrations/0001_initial.sql` in the Supabase SQL editor.
3. Create a Storage bucket named `worksheet-pdfs` and set it to public.
4. Copy your project URL, anon key, and service role key.

## Environment variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
```

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Notes

- Student PINs are hashed using `bcryptjs`.
- Failed login attempts are stored on the `students` table (`failed_attempts` and `locked_until`).
- Uploading worksheets uses the Supabase Storage bucket `worksheet-pdfs`.
