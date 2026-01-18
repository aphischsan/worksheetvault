import { requireAdmin } from "@/lib/auth";
import AdminHeader from "@/components/AdminHeader";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  requireAdmin();
  return (
    <div>
      <AdminHeader />
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
