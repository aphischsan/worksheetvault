export const dynamic = "force-dynamic";
export const revalidate = 0;

import WorksheetForm from "@/components/WorksheetForm";
import { requireStudent } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";

export default async function WorksheetPage({ params }: { params: { worksheetId: string } }) {
  const regNo = requireStudent();
  const supabase = supabaseServer();

  const { data: worksheet } = await supabase
    .from("worksheets")
    .select("id, title, pdf_url")
    .eq("id", params.worksheetId)
    .single();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, prompt, field_type, required, order_index")
    .eq("worksheet_id", params.worksheetId)
    .order("order_index", { ascending: true });

  const { data: submission } = await supabase
    .from("submissions")
    .select("status, answers_json")
    .eq("worksheet_id", params.worksheetId)
    .eq("student_reg_no", regNo)
    .maybeSingle();

  const answers = (submission?.answers_json as Record<string, string>) || {};
  const locked = submission?.status === "SUBMITTED";

  return (
    <div className="split-layout">
      <div className="card">
        <h1>{worksheet?.title}</h1>
        <div style={{ marginTop: 12 }}>
          <iframe
            src={worksheet?.pdf_url}
            title="Worksheet PDF"
            style={{ width: "100%", height: "120vh", border: "1px solid #e5e7eb", borderRadius: 12 }}
          />
        </div>
      </div>
      <div className="card">
        <h2>Answer Sheet</h2>
        <p className="muted">Responses are autosaved every 5 seconds.</p>
        <WorksheetForm
          worksheetId={params.worksheetId}
          studentRegNo={regNo}
          tasks={tasks ?? []}
          initialAnswers={answers}
          locked={locked}
        />
      </div>
    </div>
  );
}
