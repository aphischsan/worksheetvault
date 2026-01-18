import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { worksheetId, studentRegNo, status, answers } = body as {
    worksheetId: string;
    studentRegNo: string;
    status: "DRAFT" | "SUBMITTED";
    answers: Record<string, string>;
  };

  if (!worksheetId || !studentRegNo) {
    return NextResponse.json({ error: "Missing worksheet or student." }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("worksheet_id", worksheetId)
    .eq("student_reg_no", studentRegNo)
    .maybeSingle();

  if (existing?.status === "SUBMITTED") {
    return NextResponse.json({ error: "Submission is locked." }, { status: 403 });
  }

  const payload = {
    worksheet_id: worksheetId,
    student_reg_no: studentRegNo,
    status,
    answers_json: answers,
    updated_at: new Date().toISOString(),
    submitted_at: status === "SUBMITTED" ? new Date().toISOString() : null
  };

  if (existing) {
    const { error } = await supabase.from("submissions").update(payload).eq("id", existing.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("submissions").insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
