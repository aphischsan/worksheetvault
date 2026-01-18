export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminHomePage() {
  return (
    <div className="grid grid-2">
      <div className="card">
        <h1>Teacher Admin</h1>
        <p className="muted">Manage students, folders, worksheets, and submissions.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          <a className="button" href="/admin/students">Manage Students</a>
          <a className="button secondary" href="/admin/folders">Manage Folders</a>
          <a className="button secondary" href="/admin/worksheets">Manage Worksheets</a>
          <a className="button secondary" href="/admin/submissions">View Submissions</a>
        </div>
      </div>
      <div className="card">
        <h2>Quick tips</h2>
        <ul className="muted">
          <li>Create folders per class or unit.</li>
          <li>Upload PDFs and add tasks for Phase A.</li>
          <li>Publish to make worksheets visible to students.</li>
        </ul>
      </div>
    </div>
  );
}
