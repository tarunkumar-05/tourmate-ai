'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

// Fix for default Leaflet icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Custom highlighted icon
const highlightIcon = L.divIcon({
  html: `<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-white text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
         </div>`,
  className: 'custom-map-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  type?: 'destination' | 'event';
}

interface MapProps {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  interactive?: boolean;
}

// Helper to update map center
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ markers, center, zoom = 13, className = "h-full w-full rounded-2xl", interactive = true }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fix leaf icon issue globally
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  if (!mounted) return <div className={`bg-gray-100 animate-pulse ${className}`} />;

  const mapCenter = center || (markers.length > 0 ? [markers[0].latitude, markers[0].longitude] as [number, number] : [20.5937, 78.9629] as [number, number]);
  const defaultZoom = center ? zoom : (markers.length > 1 ? 5 : 10);

  return (
    <div className={`overflow-hidden relative z-0 ${className}`}>
      <MapContainer 
        center={mapCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        className="h-full w-full z-0"
      >
        {/* Using a clean, minimal tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater center={mapCenter} zoom={defaultZoom} />

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.latitude, marker.longitude]}
            icon={highlightIcon}
          >
            {interactive && (
              <Popup className="custom-popup" closeButton={false}>
                <div className="w-48 overflow-hidden rounded-xl bg-white shadow-sm -m-5">
                  {marker.image && (
                    <div className="relative h-28 w-full">
                      <Image src={marker.image} alt={marker.title} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5">{marker.title}</h4>
                    {marker.subtitle && (
                      <p className="text-xs text-gray-500 truncate mb-2">{marker.subtitle}</p>
                    )}
                    {marker.link && (
                      <Link href={marker.link} className="inline-block w-full text-center py-1.5 bg-primary text-white font-bold text-xs rounded-md hover:bg-primary-600 transition-colors">
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
