'use client';

import dynamic from 'next/dynamic';
import { MapMarkerData } from './map';

// Dynamically import the Map component with SSR disabled
const DynamicMap = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        <span className="text-sm font-medium">Loading Map...</span>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  interactive?: boolean;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
