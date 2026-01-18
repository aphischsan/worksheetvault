import clsx from "clsx";

const statusStyles: Record<string, string> = {
  "Not started": "#e2e8f0",
  Draft: "#fde68a",
  Submitted: "#bbf7d0"
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        background: statusStyles[label] || "#e2e8f0",
        color: "#1f2937",
        padding: "4px 10px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: "0.8rem"
      }}
      className={clsx("badge")}
    >
      {label}
    </span>
  );
}
