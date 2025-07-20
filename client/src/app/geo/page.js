"use client";
import LocationPicker from "@/components/LocationPicker";
import { useState } from "react";

export default function ParentComponent() {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationConfirm = (location) => {
    setSelectedLocation(location);
    setShowMap(false);
    // You can use the location data here
    console.log("Selected location:", location);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Location Picker Demo</h1>

      <button
        onClick={() => setShowMap(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {selectedLocation ? "Change Location" : "Select Location"}
      </button>

      {selectedLocation && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Selected Location</h2>
          <p>{selectedLocation.address}</p>
          <p>
            Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
            {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}

      {showMap && (
        <LocationPicker
          onConfirm={handleLocationConfirm}
          onCancel={() => setShowMap(false)}
          apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}
        />
      )}
    </div>
  );
}
