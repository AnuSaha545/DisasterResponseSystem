import { useEffect, useRef } from "react";

import { useMap } from "react-leaflet";

import L from "leaflet";

function FitMapBounds({
  requests,
  resources
}) {

  const map = useMap();

  const hasFitted = useRef(false);

  useEffect(() => {

    if (hasFitted.current) {
      return;
    }

    const bounds = [];

    requests.forEach((request) => {

      if (
        request.latitude != null &&
        request.longitude != null
      ) {

        bounds.push([
          request.latitude,
          request.longitude
        ]);

      }

    });

    resources.forEach((resource) => {

      if (
        resource.latitude != null &&
        resource.longitude != null
      ) {

        bounds.push([
          resource.latitude,
          resource.longitude
        ]);

      }

    });

    if (bounds.length > 0 && map && typeof map.fitBounds === "function") {

      map.fitBounds(
        L.latLngBounds(bounds),
        {
          padding: [60, 60]
        }
      );

      hasFitted.current = true;

    }

  }, [requests, resources, map]);

  return null;

}

export default FitMapBounds;