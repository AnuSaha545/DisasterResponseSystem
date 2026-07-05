import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

function IncidentRow({
  request,
  handleStatusUpdate,
  onView
}) {

  const icons = {
    fire: "🔥",
    medical: "🚑",
    rescue: "🛟",
    flood: "🌊",
    food: "🍞",
    water: "💧",
    general: "⚠️"
  };

  const priority = request.priority || "low";

  return (

    <tr
      className="align-middle"
      style={{
        backgroundColor:
          priority === "critical"
            ? "#FEF2F2"
            : "white",

        borderLeft:
          priority === "critical"
            ? "6px solid #DC2626"
            : priority === "high"
            ? "6px solid #F59E0B"
            : priority === "medium"
            ? "6px solid #2563EB"
            : "6px solid #22C55E"
      }}
    >

      <td className="fw-bold text-secondary">
        #{request.id}
      </td>

      <td>

        <PriorityBadge
          priority={priority}
        />

      </td>

      <td className="text-center">

        <div
          style={{
            fontSize: "30px"
          }}
        >

          {icons[request.category] || "🚨"}

        </div>

        <small
          className="text-muted text-capitalize"
        >

          {request.category}

        </small>

      </td>

      <td>

        <div className="fw-semibold">

          {request.message}

        </div>

      </td>

      <td>

        <span className="badge bg-primary">

          {request.recommended_resource || "Not Assigned"}

        </span>

      </td>

      <td>

        <StatusBadge
          status={request.status || "pending"}
        />

      </td>

      <td>

        {request.created_at
          ? new Date(
              request.created_at
            ).toLocaleString()
          : "-"}

      </td>

      <td>

        <div className="d-flex gap-2">

          <button
            className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => onView(request)}
          >

            <i className="bi bi-eye me-1"></i>

            View

          </button>

          {request.status !== "resolved" && (

            <button
              className="btn btn-success btn-sm rounded-pill"
              onClick={() =>
                handleStatusUpdate(
                  request.id,
                  "resolved"
                )
              }
            >

              <i className="bi bi-check-circle me-1"></i>

              Resolve

            </button>

          )}

        </div>

      </td>

    </tr>

  );

}

export default IncidentRow;