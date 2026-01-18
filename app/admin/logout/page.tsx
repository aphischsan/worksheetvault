import { clearAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminLogoutPage() {
  clearAdminSession();
  redirect("/admin/login");
}
