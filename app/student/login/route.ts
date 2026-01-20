import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const STUDENT_COOKIE = "student_session";

const redirectWithError = (request: Request, error: string) =>
  NextResponse.redirect(new URL(`/student/login?error=${encodeURIComponent(error)}`, request.url));

export async function POST(request: Request) {
  const formData = await request.formData();
  const regNo = String(formData.get("reg_no") || "").trim();
  const pin = String(formData.get("pin") || "").trim();

  if (!regNo || !pin) {
    return redirectWithError(request, "missing");
  }

  const supabase = supabaseServer();
  const { data: student, error } = await supabase
    .from("students")
    .select("reg_no, pin_hash, active, failed_attempts, locked_until")
    .eq("reg_no", regNo)
    .single();

  if (error || !student) {
    return redirectWithError(request, "invalid");
  }

  if (!student.active) {
    return redirectWithError(request, "inactive");
  }

  const lockedUntil = student.locked_until ? new Date(student.locked_until) : null;
  if (lockedUntil && lockedUntil > new Date()) {
    return redirectWithError(request, "locked");
  }

  const pinMatches = await bcrypt.compare(pin, student.pin_hash);
  if (!pinMatches) {
    const failedAttempts = (student.failed_attempts ?? 0) + 1;
    const updates: Record<string, string | number | null> = {
      failed_attempts: failedAttempts
    };
    if (failedAttempts >= 5) {
      updates.locked_until = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      updates.failed_attempts = 0;
    }
    await supabase.from("students").update(updates).eq("reg_no", regNo);
    return redirectWithError(request, "invalid");
  }

  await supabase
    .from("students")
    .update({ failed_attempts: 0, locked_until: null })
    .eq("reg_no", regNo);

  cookies().set(STUDENT_COOKIE, regNo, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.redirect(new URL("/student/dashboard", request.url));
}
