import { useMemo, useState } from "react";

import IncidentRow from "./IncidentRow";

function IncidentTable({
  requests,
  handleStatusUpdate,
  onView
}) {

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  const filteredRequests = useMemo(() => {

    return requests.filter((request) => {

      const matchesSearch =
        request.message
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" ||
        request.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? request.status !== "resolved"
          : request.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );

    });

  }, [
    requests,
    search,
    priorityFilter,
    statusFilter
  ]);

  return (

    <div className="card shadow border-0 rounded-4">

      <div className="card-header bg-white border-0 p-4">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h3 className="fw-bold mb-1">

              🚨 Emergency Incident Center

            </h3>

            <small className="text-muted">

              Monitor, assign and resolve emergency incidents in real time.

            </small>

          </div>

          <span className="badge rounded-pill bg-danger fs-6 px-3 py-2">

            {filteredRequests.length} Active

          </span>

        </div>

        <hr />

        <div className="row g-3">

          <div className="col-lg-5">

            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="🔍 Search by incident message..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="col-lg-3">

            <select
              className="form-select shadow-sm"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >

              <option value="all">
                🔥 All Priorities
              </option>

              <option value="critical">
                🔴 Critical
              </option>

              <option value="high">
                🟠 High
              </option>

              <option value="medium">
                🟡 Medium
              </option>

              <option value="low">
                🟢 Low
              </option>

            </select>

          </div>

          <div className="col-lg-4">

            <select
              className="form-select shadow-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="active">
                🚨 Active Incidents
              </option>

              <option value="all">
                📋 All Incidents
              </option>

              <option value="pending">
                ⏳ Pending
              </option>

              <option value="assigned">
                🚑 Assigned
              </option>

              <option value="waiting_for_resource">
                ⌛ Waiting
              </option>

              <option value="resolved">
                ✅ Resolved
              </option>

            </select>

          </div>

        </div>

      </div>

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead
            className="text-white"
            style={{
              background:
                "linear-gradient(to right, #1E293B, #334155)"
            }}
          >

            <tr>

              <th>#</th>

              <th>Priority</th>

              <th>Category</th>

              <th>Incident Details</th>

              <th>Recommended Team</th>

              <th>Status</th>

              <th>Reported Time</th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredRequests.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-5"
                >

                  <div className="text-muted">

                    <h5>

                      🎉 No incidents found

                    </h5>

                    <p className="mb-0">

                      Everything looks under control.

                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredRequests.map((request) => (

                <IncidentRow

                  key={request.id}

                  request={request}

                  handleStatusUpdate={
                    handleStatusUpdate
                  }

                  onView={onView}

                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default IncidentTable;