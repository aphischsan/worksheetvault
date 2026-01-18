import { supabaseServer } from "@/lib/supabase";

export default async function SubmissionsPage() {
  const supabase = supabaseServer();
  const { data: worksheets } = await supabase
    .from("worksheets")
    .select("id, title, class_name, is_published")
    .order("created_at", { ascending: false });

  return (
    <div className="card">
      <h1>Submissions</h1>
      <p className="muted">Open a worksheet to review student submission status.</p>
      <div className="grid" style={{ marginTop: 16 }}>
        {worksheets?.map((worksheet) => (
          <a
            key={worksheet.id}
            className="card"
            style={{ border: "1px solid #e5e7eb" }}
            href={`/admin/submissions/${worksheet.id}`}
          >
            <strong>{worksheet.title}</strong>
            <div className="muted">Class: {worksheet.class_name}</div>
            <span className="badge">{worksheet.is_published ? "Published" : "Draft"}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
