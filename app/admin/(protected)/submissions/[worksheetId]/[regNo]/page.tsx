import { supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SubmissionDetailPage({
  params
}: {
  params: { worksheetId: string; regNo: string };
}) {
  const supabase = supabaseServer();

  const { data: worksheet } = await supabase
    .from("worksheets")
    .select("id, title")
    .eq("id", params.worksheetId)
    .single();

  const { data: student } = await supabase
    .from("students")
    .select("reg_no, name")
    .eq("reg_no", params.regNo)
    .single();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, prompt, order_index")
    .eq("worksheet_id", params.worksheetId)
    .order("order_index", { ascending: true });

  const { data: submission } = await supabase
    .from("submissions")
    .select("answers_json, status, updated_at, submitted_at")
    .eq("worksheet_id", params.worksheetId)
    .eq("student_reg_no", params.regNo)
    .maybeSingle();

  const answers = (submission?.answers_json as Record<string, string>) || {};

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card">
        <h1>{worksheet?.title}</h1>
        <p className="muted">
          Student: {student?.name} ({student?.reg_no})
        </p>
        <p className="muted">
          Status: {submission?.status ?? "Not started"} · Updated: {submission?.submitted_at ?? submission?.updated_at ?? "—"}
        </p>
      </div>

      <div className="card">
        <h2>Answers</h2>
        {!submission && <p className="muted">No submission yet.</p>}
        {submission && (
          <div className="grid" style={{ gap: 16, marginTop: 12 }}>
            {tasks?.map((task, index) => (
              <div key={task.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                <div className="muted">Q{index + 1}. {task.prompt}</div>
                <div style={{ marginTop: 8 }}>{answers[task.id] || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
