"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "@geoapify/leaflet-address-search-plugin/dist/L.Control.GeoapifyAddressSearch.min.css";
import * as L from "leaflet";
import "@geoapify/leaflet-address-search-plugin";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPicker = ({
  onConfirm,
  onCancel,
  initialPosition = [27.694053, 85.317376],
  apiKey,
}) => {
  const [locationData, setLocationData] = useState(null);
  const mapRef = useRef();
  const markerRef = useRef();
  const searchControlRef = useRef();
  const mapContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(mapContainerRef.current).setView(initialPosition, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Draggable marker
    markerRef.current = L.marker(initialPosition, {
      draggable: true,
    }).addTo(map);

    // Marker drag event
    markerRef.current.on("dragend", async (e) => {
      const newPos = e.target.getLatLng();
      await reverseGeocode(newPos.lat, newPos.lng);
    });

    // Click event to move marker
    map.on("click", async (e) => {
      const clickCircle = L.circle(e.latlng, {
        radius: 5,
        color: "#3388ff",
        fillOpacity: 1,
      }).addTo(map);

      clickCircle.setRadius(30).setStyle({ fillOpacity: 0.1 });

      setTimeout(() => {
        clickCircle.remove();
      }, 300);

      markerRef.current.setLatLng(e.latlng);
      await reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    // Search control
    searchControlRef.current = L.control.addressSearch(apiKey, {
      position: "topright",
      resultCallback: (address) => {
        if (address) {
          const newPos = [address.lat, address.lon];
          map.flyTo(newPos, 15);
          markerRef.current.setLatLng(newPos);
          setLocationData({
            formattedAddress: address.formatted || null,
            name: address.name || null,
            street: address.street || null,
            suburb: address.suburb || address.neighbourhood || null,
            district: address.district || null,
            city: address.city || null,
            county: address.county || null,
            state: address.state || null,
            country: address.country || null,
            postcode: address.postcode || null,
            coordinates: {
              // Nested coordinates object
              lat: address.lat,
              lon: address.lon,
            },
            result_type: address.result_type || null,
            place_id: address.place_id || null,
          });
        }
      },
    });

    map.addControl(searchControlRef.current);

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    reverseGeocode(initialPosition[0], initialPosition[1]);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [apiKey, mounted]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      const data = await response.json();

      if (data.features?.length > 0) {
        const properties = data.features[0].properties;
        setLocationData({
          formattedAddress: properties.formatted || null,
          name: properties.name || null,
          street: properties.street || null,
          suburb: properties.suburb || properties.neighbourhood || null,
          district: properties.district || null,
          city: properties.city || null,
          county: properties.county || null,
          state: properties.state || null,
          country: properties.country || null,
          postcode: properties.postcode || null,
          coordinates: {
            lat: lat,
            lon: lng,
          },
          result_type: properties.result_type || null,
          place_id: properties.place_id || null,
        });
      }
      console.log(data);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handleConfirm = () => {
    if (locationData) {
      onConfirm(locationData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Select Location</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!locationData}
              className={`px-4 py-2 rounded ${
                locationData
                  ? "bg-[#AF0000] text-white hover:bg-[#730000]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
        <div
          ref={mapContainerRef}
          className="flex-1 min-h-[400px] w-full"
          style={{ height: "100%" }}
        />
        {locationData && (
          <div className="p-4 border-t">
            <p className="font-medium">Selected Location:</p>
            <p>{locationData.formattedAddress}</p>
            {/* <p>
              Lat: {locationData.coordinates.lat.toFixed(6)}, Lng:{" "}
              {locationData.coordinates.lon.toFixed(6)}
            </p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
