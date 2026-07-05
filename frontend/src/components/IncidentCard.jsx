import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

function IncidentCard({
  request,
  resources,
  selectedResources,
  setSelectedResources,
  handleAssign,
  handleStatusUpdate
}) {

  const emergencyIcons = {
    fire: "🔥",
    medical: "🚑",
    rescue: "🛟",
    flood: "🌊",
    food: "🍞",
    water: "💧",
    general: "⚠️"
  };

  const category = request.category || "general";
  const priority = request.priority || "low";
  const status = request.status || "pending";

  return (

    <div
      className="card shadow-lg border-0 mb-4"
      style={{
        borderLeft: `8px solid ${
          priority === "critical"
            ? "#dc3545"
            : priority === "high"
            ? "#fd7e14"
            : priority === "medium"
            ? "#ffc107"
            : "#0dcaf0"
        }`,
        borderRadius: "16px"
      }}
    >

      <div className="card-body">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h3 className="fw-bold">

              {emergencyIcons[category] || "🚨"}{" "}
              {category.toUpperCase()} INCIDENT

            </h3>

            <small className="text-muted">

              Incident #{request.id}

            </small>

          </div>

          <PriorityBadge priority={priority} />

        </div>

        <hr />

        {/* Message */}

        <h5 className="fw-semibold">

          {request.message || "No message provided"}

        </h5>

        <div className="row mt-4">

          <div className="col-md-6">

            <div className="mb-3">

              <strong>📍 GPS Location</strong>

              <br />

              {request.latitude ?? "N/A"},{" "}
              {request.longitude ?? "N/A"}

            </div>

            <div className="mb-3">

              <strong>🚒 Recommended Team</strong>

              <br />

              {request.recommended_resource || "Not Available"}

            </div>

          </div>

          <div className="col-md-6">

            <div className="mb-3">

              <strong>Status</strong>

              <br />

              <StatusBadge status={status} />

            </div>

            <div>

              <strong>🕒 Reported</strong>

              <br />

              {request.created_at
                ? new Date(request.created_at).toLocaleString()
                : "N/A"}

            </div>

          </div>

        </div>

        {/* AI Assessment */}

        <div className="alert alert-light border mt-4">

          <strong>🤖 AI Assessment</strong>

          <br />

          This incident has been classified as{" "}
          <strong>{category}</strong>{" "}
          with{" "}
          <strong>{priority}</strong>{" "}
          priority.

        </div>

        {/* Resource Assignment */}

        <div className="mt-4">

          <label className="form-label fw-semibold">

            🚑 Assign Response Team

          </label>

          <select
            className="form-select"
            value={
              selectedResources[request.id] || ""
            }
            onChange={(e) =>
              setSelectedResources({
                ...selectedResources,
                [request.id]: e.target.value
              })
            }
          >

            <option value="">
              Select Resource
            </option>

            {resources
              .filter(
                (resource) =>
                  resource.status === "available"
              )
              .map((resource) => (

                <option
                  key={resource.id}
                  value={resource.id}
                >

                  {resource.name}

                </option>

              ))}

          </select>

        </div>

        {/* Buttons */}

        <div className="d-flex gap-2 mt-4">

          <button
            className="btn btn-success"
            onClick={() =>
              handleAssign(request.id)
            }
          >

            🚒 Dispatch Team

          </button>

          {request.latitude != null &&
            request.longitude != null && (

              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${request.latitude},${request.longitude}`,
                    "_blank"
                  )
                }
              >

                📍 View Map

              </button>

            )}

        </div>

        {/* Status Update */}

        <div className="mt-4">

          <label className="form-label fw-semibold">

            Incident Status

          </label>

          <select
            className="form-select"
            value={status}
            onChange={(e) =>
              handleStatusUpdate(
                request.id,
                e.target.value
              )
            }
          >

            <option value="pending">
              Pending
            </option>

            <option value="assigned">
              Assigned
            </option>

            <option value="waiting_for_resource">
              Waiting
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="resolved">
              Resolved
            </option>

          </select>

        </div>

      </div>

    </div>

  );

}

export default IncidentCard;