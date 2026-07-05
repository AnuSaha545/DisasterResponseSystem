import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function RoutePath({ from, to }) {

  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {

    if (!from || !to || !Array.isArray(from) || !Array.isArray(to)) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    if (typeof L.Routing?.control !== "function") {
      return;
    }

    routingRef.current = L.Routing.control({

      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1])
      ],

      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      routeWhileDragging: false,
      show: false,
      showAlternatives: false,
      collapsible: true,

      createMarker: () => null,

      lineOptions: {
        styles: [
          {
            color: "#2563EB",
            weight: 5,
            opacity: 0.8
          }
        ]
      }

    }).addTo(map);

    const container = routingRef.current.getContainer();

    if (container) {
      container.style.display = "none";
    }

    return () => {

      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }

    };

  }, [map, from, to]);

  return null;

}

export default RoutePath;