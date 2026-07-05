import { useEffect, useState } from "react";
import {
  getDashboard,
  getRequests
} from "../services/api";

import DashboardChart from "../components/DashboardChart";

function Dashboard() {

  const [stats, setStats] = useState({
    total_requests: 0,
    critical_requests: 0,
    medical_requests: 0,
    food_requests: 0,
    water_requests: 0,
  });

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const dashboardData =
        await getDashboard();

      const requestData =
        await getRequests();

      setStats(dashboardData);

      setRequests(requestData);

    } catch (error) {

      console.error(
        "Error loading dashboard:",
        error
      );

    }

  };

  return (

    <div>

      <div className="mb-4">

        <h2 className="fw-bold">
          🚨 RescueSphere Dashboard
        </h2>

        <p className="text-muted">
          AI-Powered Disaster Response & Emergency Management System
        </p>

      </div>

      <div className="row g-4">

        <div className="col-md-3">

          <div className="card border-0 shadow bg-primary text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Total Requests</h6>

                <h2>{stats.total_requests}</h2>

              </div>

              <i className="bi bi-clipboard2-pulse display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow bg-danger text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Critical</h6>

                <h2>{stats.critical_requests}</h2>

              </div>

              <i className="bi bi-fire display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow bg-success text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Medical</h6>

                <h2>{stats.medical_requests}</h2>

              </div>

              <i className="bi bi-hospital display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow bg-warning text-dark">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Food</h6>

                <h2>{stats.food_requests}</h2>

              </div>

              <i className="bi bi-box-seam display-4"></i>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow bg-info text-white">

            <div className="card-body d-flex justify-content-between align-items-center">

              <div>

                <h6>Water</h6>

                <h2>{stats.water_requests}</h2>

              </div>

              <i className="bi bi-droplet-fill display-4"></i>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow mt-5">

        <div className="card-body">

          <h4 className="mb-4">

            <i className="bi bi-bar-chart-fill me-2"></i>

            Incident Analytics

          </h4>

          <div className="d-flex justify-content-center">

            <DashboardChart
              total={stats.total_requests}
              critical={stats.critical_requests}
              medical={stats.medical_requests}
            />

          </div>

        </div>

      </div>

      <div className="card shadow mt-5">

        <div className="card-header bg-dark text-white">

          <h4 className="mb-0">

            <i className="bi bi-clock-history me-2"></i>

            Recent Emergency Requests

          </h4>

        </div>

        <div className="card-body">

          {requests.length === 0 ? (

            <div className="text-center text-muted">

              No emergency requests found.

            </div>

          ) : (

            requests
              .slice(0, 5)
              .map((request) => (

                <div
                  key={request.id}
                  className="border rounded p-3 mb-3 shadow-sm"
                >

                  <h5>

                    <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>

                    {request.message}

                  </h5>

                  <div className="mt-3">

                    <p className="mb-2">

                      <strong>Category :</strong>

                      <span className="badge bg-primary ms-2">

                        {request.category}

                      </span>

                    </p>

                    <p className="mb-2">

                      <strong>Priority :</strong>

                      <span
                        className={`badge ms-2 ${
                          request.priority === "critical"
                            ? "bg-danger"
                            : request.priority === "high"
                            ? "bg-warning text-dark"
                            : request.priority === "medium"
                            ? "bg-info"
                            : "bg-success"
                        }`}
                      >

                        {request.priority}

                      </span>

                    </p>

                    <p className="mb-0">

                      <strong>Status :</strong>

                      <span
                        className={`badge ms-2 ${
                          request.status === "resolved"
                            ? "bg-success"
                            : request.status === "assigned"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >

                        {request.status}

                      </span>

                    </p>

                  </div>

                </div>

              ))

          )}

        </div>

      </div>

    </div>

  );

}

export default Dashboard;