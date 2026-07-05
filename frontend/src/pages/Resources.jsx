import { useEffect, useState } from "react";
import { getResources } from "../services/api";

function Resources() {

  const [resources, setResources] = useState([]);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {

    try {

      const data = await getResources();
      console.log("Resources:", data);

      setResources(data);

    } catch (error) {

      console.error("Error loading resources:", error);

    }

  };

  const getStatusBadge = (status) => {

    if (!status) return "secondary";

    switch (status.toLowerCase()) {

      case "available":
        return "success";

      case "busy":
        return "danger";

      case "assigned":
        return "warning";

      default:
        return "secondary";

    }

  };

  const getResourceIcon = (type) => {

    switch (type?.toLowerCase()) {

      case "fire":
        return "🚒";

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
        return "🚨";

    }

  };

  return (

    <div className="container py-4">

      <div className="mb-4">

        <h2 className="fw-bold">

          🚑 Emergency Resources

        </h2>

        <p className="text-muted">

          Monitor all emergency response teams in real time.

        </p>

      </div>

      {/* Summary Cards */}

      <div className="row g-4 mb-5">

        <div className="col-md-4">

          <div className="card border-0 shadow bg-primary text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Total Resources</h6>

                <h2>{resources.length}</h2>

              </div>

              <i className="bi bi-people-fill display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow bg-success text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Available</h6>

                <h2>

                  {
                    resources.filter(
                      (r) =>
                        r.status?.toLowerCase() === "available"
                    ).length
                  }

                </h2>

              </div>

              <i className="bi bi-check-circle-fill display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow bg-warning text-dark">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Assigned</h6>

                <h2>

                  {
                    resources.filter(
                      (r) =>
                        r.status?.toLowerCase() === "assigned"
                    ).length
                  }

                </h2>

              </div>

              <i className="bi bi-truck display-4"></i>

            </div>

          </div>

        </div>

      </div>

      {/* Resource Cards */}

      <div className="row">

        {resources.length === 0 ? (

          <div className="alert alert-info">

            No resources available.

          </div>

        ) : (

          resources.map((resource) => (

            <div
              key={resource.id}
              className="col-lg-4 col-md-6 mb-4"
            >

              <div className="card border-0 shadow h-100">

                <div className="card-body">

                  <div className="text-center mb-3">

                    <div
                      style={{
                        fontSize: "55px"
                      }}
                    >

                      {getResourceIcon(resource.resource_type)}

                    </div>

                    <h4 className="fw-bold mt-2">

                      {resource.name}

                    </h4>

                  </div>

                  <hr />

                  <p>

                    <strong>Resource Type</strong>

                    <br />

                    <span className="badge bg-primary">

                      {resource.resource_type}

                    </span>

                  </p>

                  <p>

                    <strong>Status</strong>

                    <br />

                    <span
                      className={`badge bg-${getStatusBadge(
                        resource.status
                      )}`}
                    >

                      {resource.status}

                    </span>

                  </p>

                  <p>

                    <strong>Resource ID</strong>

                    <br />

                    #{resource.id}

                  </p>

                  {resource.latitude &&
                    resource.longitude && (

                      <p className="text-muted mb-0">

                        📍 {resource.latitude.toFixed(4)},
                        {" "}
                        {resource.longitude.toFixed(4)}

                      </p>

                  )}

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Resources;