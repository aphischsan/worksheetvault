export const dynamic = "force-dynamic";
export const revalidate = 0;

import { upsertFolder } from "@/lib/actions";
import { supabaseServer } from "@/lib/supabase";

export default async function FoldersPage() {
  const supabase = supabaseServer();
  const { data: folders } = await supabase
    .from("folders")
    .select("id, title, class_name, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>Folders</h1>
        <p className="muted">Create or edit folder groupings for worksheets.</p>
        <form action={upsertFolder} className="grid grid-3" style={{ marginTop: 20 }}>
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input className="input" id="title" name="title" required />
          </div>
          <div>
            <label className="label" htmlFor="class_name">Class</label>
            <input className="input" id="class_name" name="class_name" required />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="button" type="submit">Save Folder</button>
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Existing Folders</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {folders?.map((folder) => (
            <div key={folder.id} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
              <strong>{folder.title}</strong>
              <div className="muted">Class: {folder.class_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
