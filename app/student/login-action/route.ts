import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const STUDENT_COOKIE = "wv_student";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase server env vars (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).");
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const reg_no = String(form.get("reg_no") ?? "").trim();
  const pin = String(form.get("pin") ?? "").trim();

  if (!reg_no || !pin) {
    return NextResponse.redirect(new URL("/student/login?error=missing", request.url));
  }

  const supabase = getSupabaseAdmin();

  const { data: student, error } = await supabase
    .from("students")
    .select("reg_no,pin")
    .eq("reg_no", reg_no)
    .maybeSingle();

  if (error || !student) {
    return NextResponse.redirect(new URL("/student/login?error=invalid", request.url));
  }

  // NOTE: If your DB stores hashed pins, this needs bcrypt compare.
  if (String(student.pin) !== pin) {
    return NextResponse.redirect(new URL("/student/login?error=invalid", request.url));
  }

  // Set cookie for 30 days
  cookies().set({
    name: STUDENT_COOKIE,
    value: reg_no,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL("/student/dashboard", request.url));
}

