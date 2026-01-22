import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "wv_admin";
const STUDENT_COOKIE = "wv_student";

export function setAdminSession() {
  cookies().set(ADMIN_COOKIE, "true", { 
    httpOnly: true, 
    sameSite: "lax", 
    path: "/" // Fix: Ensure cookie is available on all pages
  });
}

export function clearAdminSession() {
  cookies().set(ADMIN_COOKIE, "", { 
    expires: new Date(0), 
    path: "/" // Fix: Ensure we clear the correct cookie
  });
}

export function requireAdmin() {
  const isAuthed = cookies().get(ADMIN_COOKIE)?.value === "true";
  if (!isAuthed) {
    redirect("/admin/login");
  }
}

export function setStudentSession(regNo: string) {
  cookies().set(STUDENT_COOKIE, regNo, { 
    httpOnly: true, 
    sameSite: "lax", 
    path: "/" 
  });
}

export function clearStudentSession() {
  cookies().set(STUDENT_COOKIE, "", { 
    expires: new Date(0), 
    path: "/" 
  });
}

export function requireStudent() {
  const regNo = cookies().get(STUDENT_COOKIE)?.value;
  if (!regNo) {
    redirect("/student/login");
  }
  return regNo;
}
