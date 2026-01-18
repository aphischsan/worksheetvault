export default function HomePage() {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h1>Welcome to WorksheetVault</h1>
        <p className="muted">
          A secure worksheet repository for students and teachers. Students
          answer, save, and submit worksheets directly online.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <a className="button" href="/student/login">
            Student Login
          </a>
          <a className="button secondary" href="/admin/login">
            Teacher Admin
          </a>
        </div>
      </div>
      <div className="card">
        <h2>How it works</h2>
        <ul className="muted">
          <li>Teachers upload PDFs and assign tasks.</li>
          <li>Students authenticate with registration number + PIN.</li>
          <li>Autosave keeps submissions safe every few seconds.</li>
          <li>Teacher dashboard tracks submissions instantly.</li>
        </ul>
      </div>
    </div>
  );
}
