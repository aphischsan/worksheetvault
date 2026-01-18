export const dynamic = "force-dynamic";
export const revalidate = 0;

import { upsertStudent, resetStudentPin } from "@/lib/actions";
import { supabaseServer } from "@/lib/supabase";

export default async function StudentsPage() {
  const supabase = supabaseServer();
  const { data: students } = await supabase
    .from("students")
    .select("reg_no, name, class_name, active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>Students</h1>
        <p className="muted">Add new students or update existing records.</p>
        <form action={upsertStudent} className="grid grid-3" style={{ marginTop: 20 }}>
          <div>
            <label className="label" htmlFor="reg_no">Reg No</label>
            <input className="input" id="reg_no" name="reg_no" required />
          </div>
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input className="input" id="name" name="name" required />
          </div>
          <div>
            <label className="label" htmlFor="class_name">Class</label>
            <input className="input" id="class_name" name="class_name" required />
          </div>
          <div>
            <label className="label" htmlFor="pin">Set PIN (optional)</label>
            <input className="input" id="pin" name="pin" placeholder="4-digit PIN" />
          </div>
          <div>
            <label className="label" htmlFor="active">Active</label>
            <select className="input" id="active" name="active" defaultValue="true">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="button" type="submit">Save Student</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Current Students</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {students?.map((student) => (
            <div key={student.reg_no} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{student.name}</strong> ({student.reg_no})
                  <div className="muted">{student.class_name}</div>
                </div>
                <span className="badge">{student.active ? "Active" : "Inactive"}</span>
              </div>
              <form action={resetStudentPin} style={{ marginTop: 12, display: "flex", gap: 12 }}>
                <input type="hidden" name="reg_no" value={student.reg_no} />
                <input className="input" name="pin" placeholder="New 4-digit PIN" />
                <button className="button outline" type="submit">Reset PIN</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
