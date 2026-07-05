import { useEffect, useState } from "react";
import { createRequest, syncRequests } from "../services/api";

const OFFLINE_QUEUE_KEY = "offlineEmergencyQueue";

function SubmitRequest() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    loadQueueCount();
    captureLocation();
  }, []);

  const loadQueueCount = () => {
    const queue = JSON.parse(
      localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"
    );

    setQueuedCount(queue.length);
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setStatus(
        "Location is not available in this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        setStatus("");
      },

      () => {
        setStatus(
          "Unable to access device GPS. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const queueRequest = (requestData) => {
    const queue = JSON.parse(
      localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"
    );

    queue.push(requestData);

    localStorage.setItem(
      OFFLINE_QUEUE_KEY,
      JSON.stringify(queue)
    );

    setQueuedCount(queue.length);

    setStatus(
      "Request saved locally and will sync when the server is available."
    );
  };

  const syncOfflineQueue = async () => {
    const queue = JSON.parse(
      localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"
    );

    if (!queue.length) {
      setStatus(
        "No offline requests to sync."
      );
      return;
    }

    try {
      await syncRequests(queue);

      localStorage.removeItem(
        OFFLINE_QUEUE_KEY
      );

      setQueuedCount(0);

      setStatus(
        "Offline requests synced successfully."
      );
    } catch (error) {
      setStatus(
        "Sync failed. The queue will be retried later."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setStatus(
        "Please enter a message describing your emergency."
      );
      return;
    }

    if (
      latitude === null ||
      longitude === null
    ) {
      setStatus(
        "Waiting for GPS coordinates. Please allow location access."
      );
      return;
    }

    const requestData = {
      message: message.trim(),
      latitude,
      longitude,
    };

    try {
      const response =
        await createRequest(
          requestData
        );

      setStatus(
        `Submitted: ${response.category} / ${response.priority}`
      );

      setMessage("");

    } catch (error) {
      queueRequest(requestData);
    }
  };

  return (
    <div>
      <h2 className="mb-4">
        Submit Emergency Request
      </h2>

      <div className="alert alert-info">
        Automatic GPS:{" "}
        {latitude && longitude
          ? `${latitude.toFixed(
              5
            )}, ${longitude.toFixed(5)}`
          : "Acquiring..."}
      </div>

      <div className="alert alert-secondary">
        Offline queue: {queuedCount} request(s)
        pending sync.
      </div>

      {status && (
        <div className="alert alert-warning">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Emergency Message
          </label>

          <textarea
            className="form-control"
            rows="5"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Describe your situation in natural language..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
        >
          Submit Now
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={syncOfflineQueue}
        >
          Sync Offline Queue
        </button>
      </form>
    </div>
  );
}

export default SubmitRequest;