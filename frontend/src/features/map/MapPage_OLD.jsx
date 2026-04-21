import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import CenterCard from './components/CenterCard';
import { Search, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// 🌟 Import Config
import { API_BASE_URL } from '../../api_config';

// Leaflet fix... (omitted for brevity)

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const MapPage = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        // 🌟 Use Cloud URL
        const response = await fetch(`${API_BASE_URL}/api/centers`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCenters(data);
          setSelectedCenter(data[0]);
          // 🌟 Updated to match backend keys: lat/lng
          setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lng)]);
        }
      } catch (error) {
        console.error("Backend connection failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const handleSelect = (center) => {
    setSelectedCenter(center);
    setMapCenter([parseFloat(center.lat), parseFloat(center.lng)]);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      <div className="w-96 bg-dark-900 border-r border-dark-700 flex flex-col z-[1000] shadow-xl">
        <div className="p-6 border-b border-dark-700">
            <h2 className="text-xl font-bold text-white mb-4">Recycling Centers</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search Kolkata..." className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 py-3 text-sm text-white focus:outline-none focus:border-waste-500"/>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {centers.map(c => (
                <CenterCard 
                    key={c.id} 
                    name={c.name} // 🌟 Backend uses .name
                    status={c.status} 
                    distance={c.fill} // 🌟 Backend uses .fill string
                    isSelected={selectedCenter?.id === c.id}
                    onClick={() => handleSelect(c)}
                />
            ))}
        </div>
      </div>

      <div className="flex-1 relative bg-dark-800">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {centers.map(c => (
            <Marker key={c.id} position={[parseFloat(c.lat), parseFloat(c.lng)]}>
              <Popup>
                <div className="text-dark-900 font-bold">{c.name}</div>
                <div className="text-xs text-gray-600">{c.status}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute bottom-8 right-8 z-[1001] bg-dark-900/90 backdrop-blur-md border border-dark-600 p-6 rounded-2xl shadow-2xl max-w-sm">
            <div className="flex items-start gap-4 text-white">
                <Navigation className="w-6 h-6 text-waste-500" />
                <div>
                    <h3 className="font-bold">Live Tracking Active</h3>
                    <p className="text-gray-400 text-xs mt-1">Showing {centers.length} centers in Kolkata.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;