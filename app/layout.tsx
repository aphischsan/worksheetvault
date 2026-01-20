import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

export const metadata = {
  title: "WorksheetVault",
  description: "WorksheetVault learning workspace"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const studentRegNo = cookies().get("wv_student")?.value;
  const homeHref = studentRegNo ? "/student/dashboard" : "/";
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="container">
            <Link href={homeHref} style={{ fontWeight: 700 }}>
              WorksheetVault
            </Link>
            <div className="muted">Secure worksheet workspace</div>
            {studentRegNo && (
              <Link href="/logout" style={{ marginLeft: "auto", fontWeight: 600 }}>
                Logout
              </Link>
            )}
          </div>
        </header>
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
