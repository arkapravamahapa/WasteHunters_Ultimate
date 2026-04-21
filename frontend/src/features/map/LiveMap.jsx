import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon missing in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Handles smooth camera pan animation when a user clicks a list item
const MapController = ({ targetCenter }) => {
    const map = useMap();
    useEffect(() => {
        if (targetCenter) {
            map.flyTo(targetCenter, 14, { animate: true, duration: 1.5 });
        }
    }, [targetCenter, map]);
    return null;
};

const LiveMap = () => {
    // Default center set to Kolkata
    const [mapCenter, setMapCenter] = useState([22.5726, 88.4339]); 
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCenterId, setActiveCenterId] = useState(null);
    const [status, setStatus] = useState("Waiting for driver...");

    // --- FULL STACK UPGRADE: Dynamic State ---
    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Fetch data from your new FastAPI Database ---
    useEffect(() => {
        const fetchCenters = async () => {
            try {
                // Connecting to your Python server!
                const response = await fetch("http://localhost:8000/api/centers");
                if (!response.ok) throw new Error("Failed to fetch data");
                
                const data = await response.json();
                setRecyclingCenters(data); // Inject database data into the map
            } catch (error) {
                console.error("Error connecting to backend:", error);
                setStatus("Backend offline. Cannot load centers.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCenters();
    }, []); // Runs once when the map loads

    const handleCenterClick = (center) => {
        setMapCenter([center.lat, center.lng]);
        setActiveCenterId(center.id);
    };

    return (
        <div className="flex flex-col gap-4 w-full h-[650px] p-4 rounded-xl">
            
            {/* Top Bar: Search & Status */}
            <div className="flex flex-col md:flex-row w-full gap-4 mb-2">
                <input
                    type="text"
                    placeholder="Search Kolkata..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 bg-[#1e293b] text-white border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <div className="flex items-center px-4 py-2 bg-emerald-900/40 text-emerald-400 border border-emerald-800 rounded-lg font-bold">
                    Status: {status}
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="flex flex-col md:flex-row w-full h-full gap-4 overflow-hidden">
                
                {/* LEFT SIDEBAR: Dynamic Recycling Centers List */}
                <div className="w-full md:w-1/3 h-full overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                    <h2 className="text-xl font-bold text-white mb-2">Recycling Centers</h2>
                    
                    {isLoading ? (
                        <div className="p-4 text-emerald-400 font-bold border border-emerald-800 rounded-xl bg-[#0f172a] animate-pulse">
                            Loading from Database...
                        </div>
                    ) : (
                        recyclingCenters.map((center) => (
                            <div 
                                key={center.id}
                                onClick={() => handleCenterClick(center)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                    activeCenterId === center.id 
                                    ? "bg-[#0f172a] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                                    : "bg-[#1e293b] border-gray-700 hover:border-gray-500"
                                }`}
                            >
                                <h3 className="text-emerald-400 font-bold mb-3">{center.name}</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                        ● {center.status}
                                    </span>
                                    <span className="text-gray-400 flex items-center gap-1">
                                        📍 {center.fill}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT SIDE: The Interactive Map */}
                <div className="w-full md:w-2/3 h-full rounded-xl overflow-hidden border-2 border-emerald-500 relative z-0 shadow-lg">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        
                        <MapController targetCenter={mapCenter} />
                        
                        {/* ☀️ Bright Mode Map Tiles */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        
                        {/* Dynamic Markers from Database */}
                        {!isLoading && recyclingCenters.map((center) => {
                            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=$${center.lat},${center.lng}`;
                            return (
                                <Marker key={center.id} position={[center.lat, center.lng]}>
                                    <Popup>
                                        <div className="text-center flex flex-col gap-1 p-1">
                                            <strong className="text-emerald-700 text-lg">{center.name}</strong>
                                            <span className="text-sm text-gray-700">Capacity: {center.fill}</span>
                                            <a 
                                                href={googleMapsUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-2 px-4 rounded shadow transition-colors block w-full no-underline"
                                            >
                                                🗺️ Get Directions
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

            </div>
        </div>
    );
};

export default LiveMap;