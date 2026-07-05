import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import FitMapBounds from "../components/FitMapBounds";
import MovingResource from "../components/MovingResource";
import UserLocation from "../components/UserLocation";

import { createMarkerIcon, resourceIcons } from "../utils/mapIcons";

import {
  getRequests,
  getResources,
  getAssignments,
  makeResourceAvailable,
  resolveRequest
} from "../services/api";


import "leaflet/dist/leaflet.css";

const incidentIcons = {
  critical: createMarkerIcon("#dc2626", "❗"),
  high: createMarkerIcon("#f97316", "⚠️"),
  medium: createMarkerIcon("#f59e0b", "⚠️"),
  low: createMarkerIcon("#16a34a", "✓"),
  resolved: createMarkerIcon("#64748b", "✓")
};

function MapView() {

  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const loadData = async () => {
    try {
      const incidents = await getRequests();
      const teams = await getResources();
      const assigned = await getAssignments();

      console.log("Requests:", incidents);
      console.log("Resources:", teams);
      console.log("Assignments:", assigned);

      setRequests(incidents);
      setResources(teams);
      setAssignments(assigned);
    } catch (error) {
      console.error(error);
    }
  };

  const parseLatLng = (value) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const normalizePosition = (entity) => {
    const lat = parseLatLng(entity.latitude);
    const lng = parseLatLng(entity.longitude);
    return lat === null || lng === null ? null : [lat, lng];
  };

  const handleAssignmentArrival = async (assignment) => {
    const requestId = assignment.request_id;
    const resourceId = assignment.resource_id;

    try {
      await resolveRequest(requestId);
      await makeResourceAvailable(resourceId);
      await loadData();
    } catch (error) {
      console.error("Arrival update failed", error);
    }
  };
  useEffect(() => {

    loadData();

    const interval = setInterval(() => {

      loadData();

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const center = useMemo(() => {
    const validRequest = requests.find(
      (request) =>
        parseLatLng(request.latitude) !== null &&
        parseLatLng(request.longitude) !== null
    );

    if (validRequest) {
      return normalizePosition(validRequest);
    }

    const validResource = resources.find(
      (resource) =>
        parseLatLng(resource.latitude) !== null &&
        parseLatLng(resource.longitude) !== null
    );

    if (validResource) {
      return normalizePosition(validResource);
    }

    return [19.0760, 72.8777];
  }, [requests, resources]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [requests, resources, assignments]);

  const requestStatusById = useMemo(() => {
    return requests.reduce((map, request) => {
      map[request.id] = request.status;
      return map;
    }, {});
  }, [requests]);

  const resourcesById = useMemo(() => {
    return resources.reduce((map, resource) => {
      map[resource.id] = resource;
      return map;
    }, {});
  }, [resources]);

  const requestsById = useMemo(() => {
    return requests.reduce((map, request) => {
      map[request.id] = request;
      return map;
    }, {});
  }, [requests]);

  const activeAssignmentRoutes = useMemo(() => {
    return assignments
      .map((assignment) => {
        const requestStatus = requestStatusById[assignment.request_id];
        if (requestStatus === "resolved") {
          return null;
        }

        const resource = resourcesById[assignment.resource_id];
        const requestItem = requestsById[assignment.request_id];

        const from = resource
          ? [parseLatLng(resource.latitude), parseLatLng(resource.longitude)]
          : [
              parseLatLng(assignment.resource_latitude),
              parseLatLng(assignment.resource_longitude)
            ];

        const to = requestItem
          ? [parseLatLng(requestItem.latitude), parseLatLng(requestItem.longitude)]
          : [
              parseLatLng(assignment.request_latitude),
              parseLatLng(assignment.request_longitude)
            ];

        if (from.includes(null) || to.includes(null)) {
          return null;
        }

        return {
          assignment,
          from,
          to,
          resource,
          requestItem
        };
      })
      .filter(Boolean);
  }, [assignments, requestStatusById, resourcesById, requestsById]);

  const activeResourceIds = useMemo(() => {
    return new Set(activeAssignmentRoutes.map((item) => item.assignment.resource_id));
  }, [activeAssignmentRoutes]);

  useEffect(() => {
    console.log("MapView assignments:", assignments);
    console.log("MapView activeAssignmentRoutes:", activeAssignmentRoutes);
  }, [assignments, activeAssignmentRoutes]);

  return (

    <div>

      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>

          <h2>

            🗺 RescueSphere Live Map

          </h2>

          <p className="text-muted">

            Real-time Emergency Monitoring

          </p>

        </div>

        <span className="badge bg-dark fs-6">

          {requests.length} Incidents

        </span>

      </div>

      <div className="alert alert-light border">

        🔴 Critical &nbsp;&nbsp;

        🟠 High / Medium &nbsp;&nbsp;

        🟢 Low &nbsp;&nbsp;

        🚑 Resource Teams

      </div>

      <MapContainer
        center={center}
        zoom={13}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "12px"
        }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          setTimeout(() => {
            mapInstance.invalidateSize();
          }, 0);
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserLocation />

              <FitMapBounds
          requests={requests}
          resources={resources}
        />

        {activeAssignmentRoutes.map(({ assignment, from, to }) => (
          <Polyline
            key={`route-${assignment.id}`}
            positions={[from, to]}
            pathOptions={{
              color: "#2563EB",
              weight: 5,
              opacity: 0.9,
              dashArray: "8,6"
            }}
          />
        ))}

        {activeAssignmentRoutes.map(({ assignment, from, to, resource }) => (
          <MovingResource
            key={`moving-${assignment.id}`}
            from={from}
            to={to}
            resource={resource}
            onArrival={() => handleAssignmentArrival(assignment)}
          />
        ))}

        {requests
          .filter(
            (request) =>
              request.latitude != null &&
              request.longitude != null &&
              !Number.isNaN(parseFloat(request.latitude)) &&
              !Number.isNaN(parseFloat(request.longitude))
          )
          .map((request) => {
            const position = [
              parseFloat(request.latitude),
              parseFloat(request.longitude)
            ];

            const icon =
              request.status === "resolved"
                ? incidentIcons.resolved
                : incidentIcons[request.priority] || incidentIcons.low;
                console.log("Active Assignment Routes:", activeAssignmentRoutes);

            return (
              <Marker
                key={request.id}
                position={position}
                icon={icon}
              >
                <Popup>
                  <strong>{request.title || `Incident ${request.id}`}</strong>
                  <br />
                  Priority: {request.priority || "low"}
                  <br />
                  Status: {request.status || "unknown"}
                </Popup>
              </Marker>
            );
          })}

        {/* Idle resources are hidden on the map. Resources will appear when assigned (rendered by MovingResource). */}

</MapContainer>

    </div>

  );

}

export default MapView;