import Link from "next/link";
import BackButton from "./BackButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
          <Link href="/admin/logout">Logout</Link>
        </div>
      </header>

      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

