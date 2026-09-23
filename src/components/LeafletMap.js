"use client";

import { useEffect, useRef } from "react";

export default function LeafletMap({ lat, lng, zoom = 16, className = "" }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: "",
        html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.716 23.284 0 15 0z" fill="#1a1a1a"/><circle cx="15" cy="15" r="6" fill="#faf7f2"/></svg>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      L.marker([lat, lng], { icon: pinIcon }).addTo(map);

      instanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    }

    init();

    return () => {
      cancelled = true;
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [lat, lng, zoom]);

  return <div ref={mapRef} className={className} />;
}
