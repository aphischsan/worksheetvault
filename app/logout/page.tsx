import { clearStudentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function StudentLogoutPage() {
  clearStudentSession();
  redirect("/?loggedOut=1");
}
