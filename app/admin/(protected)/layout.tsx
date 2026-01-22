import Link from "next/link";
import BackButton from "./BackButton";
import { requireAdmin } from "@/lib/auth"; // Import this

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Fix: Enforce authentication for all admin pages
  requireAdmin();

  return (
    <div>
      <header
        style={{
          display: "flex",
          gap: 14,
          padding: 12,
          borderBottom: "1px solid #ddd",
          alignItems: "center",
        }}
      >
        <Link href="/admin">Home</Link>
        <Link href="/admin/students">Students</Link>
        <Link href="/admin/folders">Folders</Link>
        <Link href="/admin/worksheets">Worksheets</Link>

        <BackButton />

        <div style={{ marginLeft: "auto" }}>
          {/* Note: This link should ideally point to a server action or route that calls clearAdminSession */}
          <Link href="/admin/login">Logout</Link>
        </div>
      </header>

      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
