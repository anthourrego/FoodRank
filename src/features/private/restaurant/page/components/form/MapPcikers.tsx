import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  zoom?: number;
  height?: string;
}

interface LocationMarkerProps {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: LatLng;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  onSelect,
  initialPosition,
}) => {
  const [position, setPosition] = useState<LatLng | null>(
    initialPosition || null
  );

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const newPosition = marker.getLatLng();
          setPosition(newPosition);
          onSelect(newPosition.lat, newPosition.lng);
        },
      }}
    />
  );
};

const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLat = 4.5339,
  initialLng = -75.6811,
  zoom = 13,
  height = "400px",
}) => {
  const initialPosition =
    initialLat && initialLng ? new LatLng(initialLat, initialLng) : undefined;

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onSelect={onLocationSelect}
          initialPosition={initialPosition}
        />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
