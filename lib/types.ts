export type Student = {
  reg_no: string;
  name: string;
  class_name: string;
  active: boolean;
  created_at: string;
  failed_attempts: number | null;
  locked_until: string | null;
};

export type Folder = {
  id: string;
  title: string;
  class_name: string;
  created_at: string;
};

export type Worksheet = {
  id: string;
  folder_id: string;
  title: string;
  class_name: string;
  pdf_url: string;
  type: string;
  published_at: string | null;
  is_published: boolean;
};

export type Task = {
  id: string;
  worksheet_id: string;
  prompt: string;
  field_type: "SHORT_TEXT" | "LONG_TEXT";
  required: boolean;
  order_index: number;
};

export type Submission = {
  id: string;
  worksheet_id: string;
  student_reg_no: string;
  status: "DRAFT" | "SUBMITTED";
  answers_json: Record<string, string> | null;
  updated_at: string;
  submitted_at: string | null;
  generated_pdf_url: string | null;
};
