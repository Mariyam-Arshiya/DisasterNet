import { useState, useEffect } from "react";
import { MAP_CENTER } from "../data/mock";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useGeolocation() {
  const [position, setPosition] = useState({ lat: MAP_CENTER[0], lng: MAP_CENTER[1], isDefault: true });
  const [permission, setPermission] = useState("prompt");

  useEffect(() => {
    if (!navigator.geolocation) { setPermission("unsupported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, isDefault: false });
        setPermission("granted");
      },
      () => setPermission("denied"),
      { timeout: 5000 }
    );
  }, []);

  return { position, permission, distanceTo: (lat, lng) => haversine(position.lat, position.lng, lat, lng) };
}
