import "./globals.css";
import type { ReactNode } from "react";

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
            <div style={{ fontWeight: 700 }}>WorksheetVault</div>
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
