import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

function IncidentModal({ request, onClose }) {

  if (!request) return null;

  const icons = {
    fire: "🔥",
    medical: "🚑",
    rescue: "🛟",
    flood: "🌊",
    food: "🍞",
    water: "💧",
    general: "⚠️"
  };

  return (

    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)"
      }}
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h4 className="modal-title">

              {icons[request.category] || "🚨"} Incident #{request.id}

            </h4>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            <div className="mb-3">

              <strong>Priority</strong>

              <br />

              <PriorityBadge
                priority={request.priority}
              />

            </div>

            <div className="mb-3">

              <strong>Status</strong>

              <br />

              <StatusBadge
                status={request.status}
              />

            </div>

            <div className="mb-3">

              <strong>Emergency Message</strong>

              <p className="mt-2">

                {request.message}

              </p>

            </div>

            <div className="row">

              <div className="col-md-6">

                <strong>Latitude</strong>

                <p>{request.latitude}</p>

              </div>

              <div className="col-md-6">

                <strong>Longitude</strong>

                <p>{request.longitude}</p>

              </div>

            </div>

            <div className="mb-3">

              <strong>Recommended Resource</strong>

              <p>

                {request.recommended_resource}

              </p>

            </div>

            <div className="mb-3">

              <strong>Reported Time</strong>

              <p>

                {new Date(
                  request.created_at
                ).toLocaleString()}

              </p>

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >

              Close

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default IncidentModal;