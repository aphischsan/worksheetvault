import StudentLogoutButton from "@/components/StudentLogoutButton";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStudent } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";

export default async function StudentDashboardPage() {
  const regNo = requireStudent();
  const supabase = supabaseServer();

  const { data: worksheets } = await supabase
    .from("worksheets")
    .select("id, title, class_name, pdf_url, is_published, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const { data: submissions } = await supabase
    .from("submissions")
    .select("worksheet_id, status, updated_at")
    .eq("student_reg_no", regNo);

  const submissionMap = new Map<string, { status: string; updated_at: string }>();
  submissions?.forEach((submission) => {
    submissionMap.set(submission.worksheet_id, {
      status: submission.status,
      updated_at: submission.updated_at
    });
  });

  const latest = worksheets?.slice(0, 3) ?? [];
  const inProgress = worksheets?.filter((worksheet) => submissionMap.get(worksheet.id)?.status === "DRAFT") ?? [];

  return (
    <div className="grid" style={{ gap: 24 }}>
     <div className="card">
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h1>Welcome back</h1>
      <p className="muted">Registration: {regNo}</p>
    </div>
    <StudentLogoutButton />
  </div>
</div>

      <div className="card">
        <h2 className="section-title">Latest</h2>
        <div className="grid grid-3">
          {latest.map((worksheet) => (
            <WorksheetCard key={worksheet.id} worksheet={worksheet} status={submissionMap.get(worksheet.id)?.status} />
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">In Progress</h2>
        {inProgress.length === 0 && <p className="muted">No drafts yet. Start a worksheet to see it here.</p>}
        <div className="grid grid-3">
          {inProgress.map((worksheet) => (
            <WorksheetCard key={worksheet.id} worksheet={worksheet} status="DRAFT" />
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">All Worksheets</h2>
        <div className="grid grid-3">
          {worksheets?.map((worksheet) => (
            <WorksheetCard key={worksheet.id} worksheet={worksheet} status={submissionMap.get(worksheet.id)?.status} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WorksheetCard({
  worksheet,
  status
}: {
  worksheet: { id: string; title: string; class_name: string; pdf_url: string };
  status?: string;
}) {
  const label = status === "SUBMITTED" ? "Submitted" : status === "DRAFT" ? "Draft" : "Not started";
  const actionLabel = status === "SUBMITTED" ? "View" : status === "DRAFT" ? "Continue" : "Start";

  return (
    <div className="card" style={{ border: "1px solid #e5e7eb" }}>
      <strong>{worksheet.title}</strong>
      <div className="muted">Class: {worksheet.class_name}</div>
      <div style={{ marginTop: 12 }}>
        <StatusBadge label={label} />
      </div>
      <div style={{ marginTop: 16 }}>
        <a className="button" href={`/student/worksheet/${worksheet.id}`}>{actionLabel}</a>
      </div>
    </div>
  );
}
