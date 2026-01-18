"use client";

import { useState } from "react";

type FolderOption = {
  id: string;
  title: string;
  class_name: string;
};

export default function WorksheetUploadForm({ folders }: { folders: FolderOption[] }) {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/worksheets", {
      method: "POST",
      body: formData
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Failed to create worksheet.");
      return;
    }
    form.reset();
    setMessage("Worksheet created successfully.");
  };

  return (
    <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
      <div>
        <label className="label" htmlFor="title">Worksheet Title</label>
        <input className="input" id="title" name="title" required />
      </div>
      <div>
        <label className="label" htmlFor="class_name">Class</label>
        <input className="input" id="class_name" name="class_name" required />
      </div>
      <div>
        <label className="label" htmlFor="folder_id">Folder</label>
        <select className="input" id="folder_id" name="folder_id" required>
          <option value="">Select folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.title} ({folder.class_name})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="pdf">PDF Upload</label>
        <input className="input" id="pdf" name="pdf" type="file" accept="application/pdf" required />
      </div>
      <div>
        <label className="label" htmlFor="tasks_json">Tasks JSON</label>
        <textarea
          className="input"
          id="tasks_json"
          name="tasks_json"
          rows={4}
          placeholder='[{"prompt":"Short answer","field_type":"SHORT_TEXT","required":true,"order_index":0}]'
          defaultValue='[{"prompt":"Explain your answer","field_type":"LONG_TEXT","required":true,"order_index":0}]'
        />
        <p className="muted" style={{ marginTop: 6 }}>
          Use SHORT_TEXT or LONG_TEXT for field_type. Provide an array of tasks.
        </p>
      </div>
      <button className="button" type="submit">Create Worksheet</button>
      {message && <p className="muted">{message}</p>}
    </form>
  );
}
