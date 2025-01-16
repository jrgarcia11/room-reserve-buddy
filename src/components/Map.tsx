import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude?: number;
  longitude?: number;
  className?: string;
}

export function Map({ latitude, longitude, className = "" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR6NmVvYnUwMXBqMmtvOWZqcGp4ZWd2In0.Zmr2DyQVvKLRHhvGpYCEYw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [longitude || 0, latitude || 0],
      zoom: latitude && longitude ? 15 : 1,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add marker if coordinates are provided
    if (latitude && longitude) {
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
}