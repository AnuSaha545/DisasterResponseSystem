import { useEffect, useState } from "react";

import {
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

const userIcon = new L.Icon({

  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [30, 45],

  iconAnchor: [15, 45]

});

function UserLocation() {

  const map = useMap();

  const [position, setPosition] =
    useState(null);

  useEffect(() => {

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (location) => {

        const coords = [

          location.coords.latitude,

          location.coords.longitude

        ];

        setPosition(coords);

        /* map.flyTo(
          coords,
          14
        ); */

      },

      (error) => {

        console.error(error);

      }

    );

  }, [map]);

  if (!position) {

    return null;

  }

  return (

    <Marker

      position={position}

      icon={userIcon}

    >

      <Popup>

        📍 You are here

      </Popup>

    </Marker>

  );

}

export default UserLocation;