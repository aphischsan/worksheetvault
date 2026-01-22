"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  prompt: string;
  field_type: "SHORT_TEXT" | "LONG_TEXT";
  required: boolean;
};

export default function WorksheetForm({
  worksheetId,
  studentRegNo,
  tasks,
  initialAnswers,
  locked
}: {
  worksheetId: string;
  studentRegNo: string;
  tasks: Task[];
  initialAnswers: Record<string, string>;
  locked: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [status, setStatus] = useState<"DRAFT" | "SUBMITTED">("DRAFT");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Fix: Lock the form if server says so OR if client just submitted
  const isLocked = locked || status === "SUBMITTED";

  const payload = useMemo(
    () => ({
      worksheetId,
      studentRegNo,
      status,
      answers
    }),
    [worksheetId, studentRegNo, status, answers]
  );

  const saveSubmission = async (
    nextStatus: "DRAFT" | "SUBMITTED",
    nextAnswers: Record<string, string> = answers
  ) => {
    setSaveMessage(null);
    const response = await fetch("/api/student/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        status: nextStatus,
        answers: nextAnswers
      })
    });
    if (!response.ok) {
      setSaveMessage("Unable to save. Please retry.");
      return;
    }
    setSaveMessage(nextStatus === "SUBMITTED" ? "Submitted successfully." : "Saved.");
  };

  useEffect(() => {
    // Fix: Stop autosave immediately if isLocked is true
    if (isLocked) {
      return;
    }
    const interval = setInterval(() => {
      void saveSubmission("DRAFT", answers);
    }, 5000);
    return () => clearInterval(interval);
  }, [answers, isLocked]);

  const handleChange = (taskId: string, value: string) => {
    const nextAnswers = { ...answers, [taskId]: value };
    setAnswers(nextAnswers);
    if (!isLocked) {
      void saveSubmission("DRAFT", nextAnswers);
    }
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      {tasks.map((task) => (
        <div key={task.id}>
          <label className="label">
            {task.prompt}
            {task.required && <span style={{ color: "#dc2626" }}> *</span>}
          </label>
          {task.field_type === "LONG_TEXT" ? (
            <textarea
              className="input"
              rows={4}
              value={answers[task.id] || ""}
              onChange={(event) => handleChange(task.id, event.target.value)}
              disabled={isLocked}
              required={task.required}
            />
          ) : (
            <input
              className="input"
              value={answers[task.id] || ""}
              onChange={(event) => handleChange(task.id, event.target.value)}
              disabled={isLocked}
              required={task.required}
            />
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          className="button"
          type="button"
          disabled={isLocked}
          onClick={() => {
            setStatus("SUBMITTED");
            void saveSubmission("SUBMITTED", answers);
          }}
        >
          Submit Worksheet
        </button>
        {isLocked && <span className="badge">Submission locked</span>}
        {saveMessage && <span className="muted">{saveMessage}</span>}
      </div>
    </div>
  );
}
