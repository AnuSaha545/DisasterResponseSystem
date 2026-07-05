import { useEffect, useState } from "react";

import {
  getRequests,
  getResources,
  updateRequestStatus,
  createAssignment
} from "../services/api";

import DashboardSummary from "../components/DashboardSummary";
import IncidentTable from "../components/IncidentTable";
import IncidentModal from "../components/IncidentModal";
import NewIncidentModal from "../components/NewIncidentModal";

function Requests() {

  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState({});
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [showNewIncident, setShowNewIncident] =
    useState(false);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const requestData =
        await getRequests();

      const resourceData =
        await getResources();

      setRequests(requestData);

      setResources(resourceData);

    }

    catch (error) {

      console.error(error);

    }

  };

  const handleStatusUpdate = async (
    requestId,
    status
  ) => {

    try {

      await updateRequestStatus(
        requestId,
        status
      );

      loadData();

    }

    catch (error) {

      console.error(error);

    }

  };

  const handleAssign = async (
    requestId
  ) => {

    const resourceId =
      selectedResources[
        requestId
      ];

    if (!resourceId) {

      alert(
        "Please select a resource."
      );

      return;

    }

    try {

      await createAssignment(
        requestId,
        parseInt(resourceId)
      );

      loadData();

    }

    catch (error) {

      console.error(error);

      alert(
        "Assignment failed."
      );

    }

  };

  return (

    <div className="container py-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">

            🚨 RescueSphere Command Center

          </h2>

          <p className="text-muted">

            Live Incident Monitoring

          </p>

        </div>

        <div className="d-flex gap-2">

          <span className="badge bg-dark fs-6">

            {requests.length} Incident(s)

          </span>

          <button
            className="btn btn-danger"
            onClick={() =>
              setShowNewIncident(true)
            }
          >

            + New Incident

          </button>

        </div>

      </div>

      {/* Dashboard */}

      <DashboardSummary

        requests={requests}

        resources={resources}

      />

      {/* Incident Table */}

      <IncidentTable

        requests={requests}

        resources={resources}

        selectedResources={
          selectedResources
        }

        setSelectedResources={
          setSelectedResources
        }

        handleAssign={
          handleAssign
        }

        handleStatusUpdate={
          handleStatusUpdate
        }

        onView={
          setSelectedIncident
        }

      />

      {/* View Incident Modal */}

      <IncidentModal

        request={selectedIncident}

        onClose={() =>
          setSelectedIncident(null)
        }

      />

      {/* Create Incident Modal */}

      <NewIncidentModal

        show={showNewIncident}

        onClose={() =>
          setShowNewIncident(false)
        }

        onSuccess={() => {

          loadData();

        }}

      />

    </div>

  );

}

export default Requests;