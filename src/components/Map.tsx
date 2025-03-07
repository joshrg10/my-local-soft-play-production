import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Database } from '../types/supabase';

type Playground = Database['public']['Tables']['playgrounds']['Row'];

interface MapProps {
  playground?: Playground;
  playgrounds?: Playground[];
  height?: string;
  zoom?: number;
  center?: [number, number];
}

const Map: React.FC<MapProps> = ({ 
  playground, 
  playgrounds = [], 
  height = '400px',
  zoom = 13,
  center
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // If a single playground is provided, use its coordinates
  if (playground && playground.latitude && playground.longitude) {
    center = [playground.latitude, playground.longitude];
  }
  
  // If multiple playgrounds are provided but no center, use the first one's coordinates
  else if (playgrounds.length > 0 && !center) {
    const firstWithCoords = playgrounds.find(p => p.latitude && p.longitude);
    if (firstWithCoords) {
      center = [firstWithCoords.latitude, firstWithCoords.longitude];
    }
  }
  
  // Default to London if no coordinates are available
  if (!center) {
    center = [51.505, -0.09];
  }

  // Lazy load the map when it's in viewport
  useEffect(() => {
    // Use Intersection Observer to detect when map container is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setMapLoaded(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      observer.observe(mapContainer);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div id="map-container" style={{ height }}>
      {mapLoaded ? (
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Single playground marker */}
          {playground && playground.latitude && playground.longitude && (
            <Marker position={[playground.latitude, playground.longitude]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{playground.name}</h3>
                  <p>{playground.address}</p>
                  <p>{playground.city}, {playground.postcode}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Multiple playground markers */}
          {playgrounds.map((p) => {
            if (p.latitude && p.longitude) {
              return (
                <Marker key={p.id} position={[p.latitude, p.longitude]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p>{p.address}</p>
                      <p>{p.city}, {p.postcode}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;