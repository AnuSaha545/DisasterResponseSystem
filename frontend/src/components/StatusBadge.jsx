function StatusBadge({ status }) {

  const colors = {
    assigned: "success",
    pending: "secondary",
    waiting_for_resource: "warning",
    in_progress: "primary",
    resolved: "dark"
  };

  const labels = {
    assigned: "🟢 Assigned",
    pending: "⚪ Pending",
    waiting_for_resource: "🟡 Waiting",
    in_progress: "🔵 In Progress",
    resolved: "✅ Resolved"
  };

  return (
    <span
      className={`badge bg-${colors[status] || "secondary"} fs-6`}
    >
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;