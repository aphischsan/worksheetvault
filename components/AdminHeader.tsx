"use client";

import Link from "next/link";

export default function AdminHeader() {
  return (
    <header style={{ display: "flex", gap: 14, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link href="/admin">Home</Link>
      <Link href="/admin/students">Students</Link>
      <Link href="/admin/folders">Folders</Link>
      <Link href="/admin/worksheets">Worksheets</Link>

      <button
        type="button"
        onClick={() => history.back()}
        style={{ cursor: "pointer" }}
        aria-label="Go back"
      >
        Back
      </button>

      <div style={{ marginLeft: "auto" }}>
        <Link href="/admin/logout">Logout</Link>
      </div>
    </header>
  );
}
