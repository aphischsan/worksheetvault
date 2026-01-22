"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setAdminSession, setStudentSession } from "./auth";
import { supabaseServer } from "./supabase";

export async function adminLogin(
  _prevState: { error: string },
  formData: FormData
) {
  const password = String(formData.get("password") || "");
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "ADMIN_PASSWORD is not configured." };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Incorrect password" };
  }
  setAdminSession();
  redirect("/admin");
}

export async function studentLogin(
  _prevState: { error: string },
  formData: FormData
) {
  const regNo = String(formData.get("reg_no") || "").trim();
  const pin = String(formData.get("pin") || "").trim();
  if (!regNo || !pin) {
    return { error: "Please enter registration number and PIN." };
  }

  const supabase = supabaseServer();
  const { data: student, error } = await supabase
    .from("students")
    .select("reg_no, pin_hash, active, failed_attempts, locked_until")
    .eq("reg_no", regNo)
    .single();

  if (error || !student) {
    return { error: "Invalid registration number or PIN." };
  }

  if (!student.active) {
    return { error: "This student is deactivated. Contact your teacher." };
  }

  const lockedUntil = student.locked_until ? new Date(student.locked_until) : null;
  if (lockedUntil && lockedUntil > new Date()) {
    return { error: "Account locked. Please wait 2 minutes before retrying." };
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
    return { error: "Invalid registration number or PIN." };
  }

  await supabase
    .from("students")
    .update({ failed_attempts: 0, locked_until: null })
    .eq("reg_no", regNo);

  setStudentSession(regNo);
  redirect("/student/dashboard");
}

export async function upsertStudent(formData: FormData) {
  const regNo = String(formData.get("reg_no") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const className = String(formData.get("class_name") || "").trim();
  const pin = String(formData.get("pin") || "").trim();
  const active = String(formData.get("active") || "true") === "true";

  if (!regNo || !name || !className) {
    return { error: "Registration number, name, and class are required." };
  }

  const supabase = supabaseServer();
  let pinHash: string | undefined;
  if (pin) {
    pinHash = await bcrypt.hash(pin, 10);
  }

  const payload: Record<string, string | boolean> = {
    reg_no: regNo,
    name,
    class_name: className,
    active
  };
  if (pinHash) {
    payload.pin_hash = pinHash;
  }

  await supabase.from("students").upsert(payload, { onConflict: "reg_no" });
  revalidatePath("/admin/students");
  return { success: true };
}

export async function resetStudentPin(formData: FormData) {
  const regNo = String(formData.get("reg_no") || "").trim();
  const pin = String(formData.get("pin") || "").trim();
  if (!regNo || !pin) {
    return { error: "Registration number and PIN required." };
  }
  const supabase = supabaseServer();
  const pinHash = await bcrypt.hash(pin, 10);
  await supabase
    .from("students")
    .update({ pin_hash: pinHash })
    .eq("reg_no", regNo);
  revalidatePath("/admin/students");
  return { success: true };
}

export async function upsertFolder(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const className = String(formData.get("class_name") || "").trim();
  if (!title || !className) {
    return { error: "Title and class are required." };
  }
  const supabase = supabaseServer();
  if (id) {
    await supabase.from("folders").update({ title, class_name: className }).eq("id", id);
  } else {
    await supabase.from("folders").insert({ title, class_name: className });
  }
  revalidatePath("/admin/folders");
  return { success: true };
}

export async function toggleWorksheetPublish(formData: FormData) {
  const worksheetId = String(formData.get("worksheet_id") || "").trim();
  const isPublished = String(formData.get("is_published") || "false") === "true";
  const supabase = supabaseServer();
  await supabase
    .from("worksheets")
    .update({ is_published: isPublished, published_at: isPublished ? new Date().toISOString() : null })
    .eq("id", worksheetId);
  revalidatePath("/admin/worksheets");
  return { success: true };
}
export async function studentLogout() {
  const { clearStudentSession } = await import("./auth");
  clearStudentSession();
}
