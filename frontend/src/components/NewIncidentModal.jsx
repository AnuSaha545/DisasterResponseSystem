import { useEffect, useState } from "react";
import { createRequest } from "../services/api";

function NewIncidentModal({
  show,
  onClose,
  onSuccess
}) {

  const [message, setMessage] = useState("");

  const [latitude, setLatitude] = useState("");

  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  useEffect(() => {

    if (!show) return;

    getCurrentLocation();

  }, [show]);

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      setLocationError(
        "Geolocation is not supported."
      );

      return;

    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(
          position.coords.latitude.toFixed(6)
        );

        setLongitude(
          position.coords.longitude.toFixed(6)
        );

        setLocationLoading(false);

        setLocationError("");

      },

      () => {

        setLocationLoading(false);

        setLocationError(
          "Location permission denied."
        );

      }

    );

  };

  if (!show) return null;

  const handleSubmit = async () => {

    if (
      !message ||
      !latitude ||
      !longitude
    ) {

      alert(
        "Please complete all fields."
      );

      return;

    }

    try {

      setLoading(true);

      await createRequest({

        message,

        latitude: parseFloat(latitude),

        longitude: parseFloat(longitude)

      });

      setMessage("");

      onSuccess();

      onClose();

    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to submit incident."
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,.55)"
      }}
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h4>

              🚨 Report New Emergency

            </h4>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            <label className="form-label">

              Emergency Description

            </label>

            <textarea

              className="form-control"

              rows="4"

              placeholder="Describe the emergency..."

              value={message}

              onChange={(e)=>
                setMessage(e.target.value)
              }

            />

            <div className="mt-4">

              <h6>

                📍 Current Location

              </h6>

              {locationLoading && (

                <div className="text-primary">

                  Detecting location...

                </div>

              )}

              {locationError && (

                <div className="text-danger">

                  {locationError}

                </div>

              )}

            </div>

            <div className="row mt-3">

              <div className="col-md-6">

                <label>

                  Latitude

                </label>

                <input

                  className="form-control"

                  value={latitude}

                  readOnly

                />

              </div>

              <div className="col-md-6">

                <label>

                  Longitude

                </label>

                <input

                  className="form-control"

                  value={longitude}

                  readOnly

                />

              </div>

            </div>

            <button

              className="btn btn-outline-primary mt-3"

              onClick={getCurrentLocation}

            >

              📍 Refresh Current Location

            </button>

          </div>

          <div className="modal-footer">

            <button

              className="btn btn-secondary"

              onClick={onClose}

            >

              Cancel

            </button>

            <button

              className="btn btn-danger"

              disabled={loading}

              onClick={handleSubmit}

            >

              {loading

                ? "Submitting..."

                : "Submit Incident"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default NewIncidentModal;