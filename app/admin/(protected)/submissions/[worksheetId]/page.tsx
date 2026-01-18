import { StatusBadge } from "@/components/StatusBadge";
import { supabaseServer } from "@/lib/supabase";

export default async function WorksheetSubmissionsPage({
  params,
  searchParams
}: {
  params: { worksheetId: string };
  searchParams: { student?: string };
}) {
  const supabase = supabaseServer();
  const { data: worksheet } = await supabase
    .from("worksheets")
    .select("id, title, class_name")
    .eq("id", params.worksheetId)
    .single();

  const { data: students } = await supabase
    .from("students")
    .select("reg_no, name")
    .eq("class_name", worksheet?.class_name || "");

  const { data: submissions } = await supabase
    .from("submissions")
    .select("student_reg_no, status, answers_json")
    .eq("worksheet_id", params.worksheetId);

  const statusMap = new Map<string, { status: string; answers: Record<string, string> | null }>();
  submissions?.forEach((submission) => {
    statusMap.set(submission.student_reg_no, {
      status: submission.status === "SUBMITTED" ? "Submitted" : "Draft",
      answers: submission.answers_json as Record<string, string> | null
    });
  });

  const selectedStudent = searchParams.student;
  const selectedAnswers = selectedStudent ? statusMap.get(selectedStudent)?.answers : null;

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>{worksheet?.title}</h1>
        <p className="muted">Class: {worksheet?.class_name}</p>
        <div className="grid" style={{ marginTop: 16 }}>
          {students?.map((student) => {
            const entry = statusMap.get(student.reg_no);
            const status = entry?.status || "Not started";
            return (
              <div key={student.reg_no} className="card" style={{ border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{student.name}</strong>
                    <div className="muted">{student.reg_no}</div>
                  </div>
                  <StatusBadge label={status} />
                </div>
                {status !== "Not started" && (
                  <a
                    className="button outline"
                    style={{ marginTop: 12 }}
                    href={`/admin/submissions/${params.worksheetId}?student=${student.reg_no}`}
                  >
                    View Answers
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {selectedStudent && (
        <div className="card">
          <h2>Answers for {selectedStudent}</h2>
          {!selectedAnswers && <p className="muted">No answers saved yet.</p>}
          {selectedAnswers && (
            <div className="grid" style={{ marginTop: 12 }}>
              {Object.entries(selectedAnswers).map(([taskId, answer]) => (
                <div key={taskId} style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>Task {taskId}</div>
                  <div>{answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
