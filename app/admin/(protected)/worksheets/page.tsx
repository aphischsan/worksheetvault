export const dynamic = "force-dynamic";
export const revalidate = 0;

import WorksheetUploadForm from "@/components/WorksheetUploadForm";
import { toggleWorksheetPublish } from "@/lib/actions";
import { supabaseServer } from "@/lib/supabase";

export default async function WorksheetsPage() {
  const supabase = supabaseServer();
  const { data: folders } = await supabase
    .from("folders")
    .select("id, title, class_name")
    .order("title", { ascending: true });

  const { data: worksheets } = await supabase
    .from("worksheets")
    .select("id, title, class_name, pdf_url, is_published, published_at")
    .order("created_at", { ascending: false });

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>Worksheets</h1>
        <p className="muted">Upload PDFs, add Phase A tasks, and publish worksheets.</p>
        <WorksheetUploadForm folders={folders ?? []} />
      </div>
      <div className="card">
        <h2>Existing Worksheets</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {worksheets?.map((worksheet) => (
            <div key={worksheet.id} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{worksheet.title}</strong>
                  <div className="muted">Class: {worksheet.class_name}</div>
                </div>
                <span className="badge">{worksheet.is_published ? "Published" : "Draft"}</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <a className="button outline" href={worksheet.pdf_url} target="_blank" rel="noreferrer">
                  View PDF
                </a>
                <form action={toggleWorksheetPublish}>
                  <input type="hidden" name="worksheet_id" value={worksheet.id} />
                  <input type="hidden" name="is_published" value={(!worksheet.is_published).toString()} />
                  <button className="button secondary" type="submit">
                    {worksheet.is_published ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
