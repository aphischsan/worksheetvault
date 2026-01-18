"use client";

export default function BackButton() {
  return (
    <button type="button" onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
      Back
    </button>
  );
}
