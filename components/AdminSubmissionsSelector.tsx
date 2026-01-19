"use client";

import { useRouter, useSearchParams } from "next/navigation";

type WorksheetOption = {
  id: string;
  title: string;
  created_at: string;
  published_at: string | null;
};

export default function AdminSubmissionsSelector({
  worksheets,
  selectedWorksheetId
}: {
  worksheets: WorksheetOption[];
  selectedWorksheetId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (nextId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextId) {
      params.set("worksheet", nextId);
    } else {
      params.delete("worksheet");
    }
    const query = params.toString();
    router.push(query ? `/admin/submissions?${query}` : "/admin/submissions");
  };

  return (
    <div style={{ marginTop: 16 }}>
      <label className="label" htmlFor="worksheet">
        Worksheet
      </label>
      <select
        className="input"
        id="worksheet"
        name="worksheet"
        value={selectedWorksheetId ?? ""}
        onChange={(event) => handleChange(event.target.value)}
      >
        <option value="">Select a published worksheet</option>
        {worksheets.map((worksheet) => (
          <option key={worksheet.id} value={worksheet.id}>
            {worksheet.title} · {worksheet.published_at ?? worksheet.created_at}
          </option>
        ))}
      </select>
    </div>
  );
}
