import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const className = String(formData.get("class_name") || "").trim();
  const folderId = String(formData.get("folder_id") || "").trim();
  const type = String(formData.get("type") || "Phase A").trim();
  const tasksJson = String(formData.get("tasks_json") || "[]");
  const file = formData.get("pdf") as File | null;

  if (!title || !className || !folderId || !file) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = supabaseServer();
  const fileName = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("worksheet-pdfs")
    .upload(fileName, file, { contentType: file.type || "application/pdf" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage
    .from("worksheet-pdfs")
    .getPublicUrl(fileName);

  const { data: worksheet, error: worksheetError } = await supabase
    .from("worksheets")
    .insert({
      title,
      class_name: className,
      folder_id: folderId,
      pdf_url: publicUrl.publicUrl,
      type,
      is_published: false
    })
    .select("id")
    .single();

  if (worksheetError || !worksheet) {
    return NextResponse.json({ error: worksheetError?.message || "Unable to create worksheet." }, { status: 500 });
  }

  let tasks: Array<{ prompt: string; field_type: string; required: boolean; order_index: number }> = [];
  try {
    tasks = JSON.parse(tasksJson);
  } catch (error) {
    return NextResponse.json({ error: "Tasks JSON is invalid." }, { status: 400 });
  }

  if (tasks.length) {
    const payload = tasks.map((task, index) => ({
      worksheet_id: worksheet.id,
      prompt: task.prompt,
      field_type: task.field_type,
      required: Boolean(task.required),
      order_index: task.order_index ?? index
    }));
    await supabase.from("tasks").insert(payload);
  }

  return NextResponse.json({ success: true, worksheet_id: worksheet.id });
}
