import { StatusBadge } from "@/components/StatusBadge";
import { supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SubmissionRow = {
  student_reg_no: string;
  status: "DRAFT" | "SUBMITTED";
  updated_at: string;
  submitted_at: string | null;
};

export default async function SubmissionsPage({
  searchParams
}: {
  searchParams: { worksheet?: string };
}) {
  const supabase = supabaseServer();
  const { data: worksheets } = await supabase
    .from("worksheets")
    .select("id, title, class_name, created_at, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const selectedWorksheetId = searchParams.worksheet;
  const selectedWorksheet = worksheets?.find((worksheet) => worksheet.id === selectedWorksheetId);

  const { data: students } = selectedWorksheet
    ? await supabase
        .from("students")
        .select("reg_no, name")
        .eq("class_name", selectedWorksheet.class_name)
        .order("name", { ascending: true })
    : { data: [] };

  const { data: submissions } = selectedWorksheet
    ? await supabase
        .from("submissions")
        .select("student_reg_no, status, updated_at, submitted_at")
        .eq("worksheet_id", selectedWorksheet.id)
    : { data: [] };

  const submissionMap = new Map<string, SubmissionRow>();
  submissions?.forEach((submission) => {
    submissionMap.set(submission.student_reg_no, submission as SubmissionRow);
  });

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>Submissions</h1>
        <p className="muted">Select a worksheet to review student submission status.</p>
        <form style={{ marginTop: 16 }}>
          <label className="label" htmlFor="worksheet">Worksheet</label>
          <select
            className="input"
            id="worksheet"
            name="worksheet"
            defaultValue={selectedWorksheetId ?? ""}
            onChange={(event) => event.currentTarget.form?.submit()}
          >
            <option value="">Select a published worksheet</option>
            {worksheets?.map((worksheet) => (
              <option key={worksheet.id} value={worksheet.id}>
                {worksheet.title} · {worksheet.published_at ?? worksheet.created_at}
              </option>
            ))}
          </select>
        </form>
      </div>

      {selectedWorksheet && (
        <div className="card">
          <h2>{selectedWorksheet.title}</h2>
          <p className="muted">Class: {selectedWorksheet.class_name}</p>
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Student</th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Reg No</th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Updated/Submitted</th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => {
                  const submission = submissionMap.get(student.reg_no);
                  const statusLabel = submission
                    ? submission.status === "SUBMITTED"
                      ? "Submitted"
                      : "Draft"
                    : "Not started";
                  const timestamp = submission?.submitted_at ?? submission?.updated_at ?? "—";
                  return (
                    <tr key={student.reg_no} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "8px 12px" }}>{student.name}</td>
                      <td style={{ padding: "8px 12px" }}>{student.reg_no}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <StatusBadge label={statusLabel} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>{timestamp}</td>
                      <td style={{ padding: "8px 12px" }}>
                        {submission ? (
                          <a
                            className="button outline"
                            href={`/admin/submissions/${selectedWorksheet.id}/${student.reg_no}`}
                          >
                            View
                          </a>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
