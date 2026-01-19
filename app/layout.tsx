import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "WorksheetVault",
  description: "WorksheetVault learning workspace"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="container">
            <Link href="/" style={{ fontWeight: 700 }}>
              WorksheetVault
            </Link>
            <div className="muted">Secure worksheet workspace</div>
          </div>
        </header>
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
