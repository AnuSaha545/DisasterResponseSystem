function PriorityBadge({ priority }) {

  const colors = {
    critical: "danger",
    high: "warning",
    medium: "info",
    low: "secondary"
  };

  const icons = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🔵"
  };

  return (
    <span
      className={`badge bg-${colors[priority] || "secondary"} fs-6`}
    >
      {icons[priority]} {priority?.toUpperCase()}
    </span>
  );
}

export default PriorityBadge;