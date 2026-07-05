import { useEffect, useState } from "react";

import { getRequests } from "../services/api";

import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import IncidentModal from "../components/IncidentModal";

function History() {

  const [requests, setRequests] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory = async () => {

    try {

      const data = await getRequests();

      const resolved = data.filter(

        (request) => request.status === "resolved"

      );

      setRequests(resolved);

    }

    catch (error) {

      console.error(error);

    }

  };

  const filteredRequests = requests.filter(

    (request) =>

      request.message
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      request.category
        .toLowerCase()
        .includes(search.toLowerCase())

  );

  const getCategoryIcon = (category) => {

    switch (category?.toLowerCase()) {

      case "fire":
        return "🔥";

      case "medical":
        return "🚑";

      case "rescue":
        return "🛟";

      case "food":
        return "🍱";

      case "water":
        return "💧";

      case "flood":
        return "🌊";

      default:
        return "⚠️";

    }

  };

  return (

    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">

            📜 Incident History

          </h2>

          <p className="text-muted">

            Archive of successfully resolved emergency incidents.

          </p>

        </div>

        <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">

          {filteredRequests.length} Resolved

        </span>

      </div>

      <div className="card shadow border-0 rounded-4">

        <div className="card-header bg-white border-0 p-4">

          <div className="row">

            <div className="col-md-6">

              <input

                className="form-control shadow-sm"

                placeholder="🔍 Search by message or category..."

                value={search}

                onChange={(e) =>
                  setSearch(e.target.value)
                }

              />

            </div>

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead
              className="text-white"
              style={{
                background:
                  "linear-gradient(to right,#1E293B,#334155)"
              }}
            >

              <tr>

                <th>#</th>

                <th>Priority</th>

                <th>Category</th>

                <th>Incident</th>

                <th>Status</th>

                <th>Resolved On</th>

                <th className="text-center">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRequests.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-5 text-muted"
                  >

                    <h5>

                      🎉 No resolved incidents found.

                    </h5>

                  </td>

                </tr>

              ) : (

                filteredRequests.map((request) => (

                  <tr key={request.id}>

                    <td className="fw-bold">

                      #{request.id}

                    </td>

                    <td>

                      <PriorityBadge
                        priority={request.priority}
                      />

                    </td>

                    <td>

                      <div
                        className="text-center"
                        style={{
                          fontSize: "24px"
                        }}
                      >

                        {getCategoryIcon(request.category)}

                        <br />

                        <small className="text-muted text-capitalize">

                          {request.category}

                        </small>

                      </div>

                    </td>

                    <td>

                      <div
                        className="fw-semibold"
                        style={{
                          maxWidth: "320px"
                        }}
                      >

                        {request.message}

                      </div>

                    </td>

                    <td>

                      <StatusBadge
                        status={request.status}
                      />

                    </td>

                    <td>

                      {request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleString()
                        : "-"}

                    </td>

                    <td className="text-center">

                      <button

                        className="btn btn-outline-primary btn-sm rounded-pill"

                        onClick={() =>
                          setSelectedIncident(request)
                        }

                      >

                        <i className="bi bi-eye me-1"></i>

                        View

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      <IncidentModal

        request={selectedIncident}

        onClose={() =>
          setSelectedIncident(null)
        }

      />

    </div>

  );

}

export default History;