import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";

import L from "leaflet";
import { resourceIcons } from "../utils/mapIcons";

const movingIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45]
});

function MovingResource({
  from,
  to,
  onArrival,
  resource
}) {

  const [position, setPosition] = useState(from);

  useEffect(() => {

    if (!from || !to || !Array.isArray(from) || !Array.isArray(to)) return;

    setPosition(from);

    let progress = 0;

    const interval = setInterval(() => {

      progress += 0.02;

      if (progress >= 1) {

        setPosition(to);

        clearInterval(interval);

        if (onArrival) {
          onArrival();
        }

        return;

      }

      const lat =
        from[0] +
        (to[0] - from[0]) * progress;

      const lng =
        from[1] +
        (to[1] - from[1]) * progress;

      setPosition([
        lat,
        lng
      ]);

    }, 100);

    return () => clearInterval(interval);

  }, [from, to, onArrival]);

  if (!position) return null;

  // choose icon based on resource type when available
  let icon = movingIcon;
  try {
    const typeKey = resource && resource.resource_type ? resource.resource_type.toString().toLowerCase().trim() : "";
    icon = typeKey ? (resourceIcons[typeKey] || resourceIcons.default) : movingIcon;
  } catch (e) {
    icon = movingIcon;
  }

  return <Marker position={position} icon={icon} />;

}

export default MovingResource;