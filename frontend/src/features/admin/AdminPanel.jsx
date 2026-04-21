import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    // Notice we changed 'fill' to just be a number (0)
    const [formData, setFormData] = useState({ name: "", lat: "", lng: "", status: "Active", fill: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [centersList, setCentersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCenters = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/centers");
            if (response.ok) {
                const data = await response.json();
                setCentersList(data);
            }
        } catch (error) {
            console.error("Failed to load centers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCenters(); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:8000/api/centers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                    status: formData.status,
                    // We automatically add "% Full" here so the backend stays happy!
                    fill: `${formData.fill}% Full` 
                })
            });

            if (!response.ok) throw new Error("Failed to add center");

            setMessage({ type: "success", text: "✅ New Recycling Center successfully deployed!" });
            setFormData({ name: "", lat: "", lng: "", status: "Active", fill: 0 });
            fetchCenters(); 

        } catch (error) {
            setMessage({ type: "error", text: "❌ Error connecting to server." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
        try {
            const response = await fetch(`http://localhost:8000/api/centers/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete");
            setMessage({ type: "success", text: `🗑️ Successfully deleted "${name}".` });
            fetchCenters(); 
        } catch (error) {
            setMessage({ type: "error", text: "❌ Error deleting center." });
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-8 mt-6">
            
            {message && (
                <div className={`p-4 rounded-lg font-bold shadow-lg ${message.type === 'success' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT SIDE: More Attractive "Add New Hub" Form */}
                <div className="flex-1 bg-[#0b1120] p-8 rounded-2xl border border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                    <div className="mb-8 border-b border-gray-800 pb-4">
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <span className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">⚙️</span> 
                            Add New Hub
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">Deploy a new verified recycling location to the live map.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {/* Facility Name */}
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 focus-within:border-emerald-500 transition-colors">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facility Name</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Eco Park Tech Drop" className="w-full bg-transparent text-white text-lg focus:outline-none placeholder-gray-600" />
                        </div>

                        {/* Coordinates Row */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-[#1e293b] p-4 rounded-xl border border-gray-700 focus-within:border-emerald-500 transition-colors">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Latitude (Lat)</label>
                                <input required type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} placeholder="22.5726" className="w-full bg-transparent text-white text-lg focus:outline-none placeholder-gray-600" />
                            </div>
                            <div className="flex-1 bg-[#1e293b] p-4 rounded-xl border border-gray-700 focus-within:border-emerald-500 transition-colors">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Longitude (Lng)</label>
                                <input required type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} placeholder="88.3639" className="w-full bg-transparent text-white text-lg focus:outline-none placeholder-gray-600" />
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 focus-within:border-emerald-500 transition-colors">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Operational Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-transparent text-white text-lg focus:outline-none cursor-pointer">
                                <option value="Active" className="bg-[#1e293b]">🟢 Active (Accepting)</option>
                                <option value="Busy" className="bg-[#1e293b]">🟡 Busy (High Traffic)</option>
                                <option value="Offline" className="bg-[#1e293b]">🔴 Offline (Maintenance)</option>
                            </select>
                        </div>

                        {/* NEW: Interactive Manual Capacity Slider */}
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 focus-within:border-emerald-500 transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Current Capacity</label>
                                <span className={`text-xl font-black ${formData.fill > 80 ? 'text-red-500' : formData.fill > 50 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                    {formData.fill}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                name="fill" 
                                min="0" 
                                max="100" 
                                value={formData.fill} 
                                onChange={handleChange} 
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
                                <span>Empty</span>
                                <span>Full</span>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:bg-gray-600 disabled:shadow-none text-lg">
                            {isSubmitting ? "Deploying..." : "🚀 Deploy Hub to Live Map"}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE: Manage Existing Centers List */}
                <div className="flex-1 bg-[#0b1120] p-8 rounded-2xl border border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.5)] h-[750px] flex flex-col">
                    <div className="mb-6 border-b border-gray-800 pb-4">
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <span className="bg-blue-500/20 p-2 rounded-lg text-blue-500">📋</span> 
                            Manage Live Hubs
                        </h1>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar flex flex-col gap-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-emerald-500 animate-pulse font-bold text-lg">Loading database...</p>
                            </div>
                        ) : (
                            centersList.map((center) => (
                                <div key={center.id} className="bg-[#1e293b] border border-gray-700 p-5 rounded-xl flex justify-between items-center hover:border-gray-500 transition-all shadow-md group">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{center.name}</h3>
                                        <div className="flex gap-3 text-xs text-gray-400 mt-2 font-medium">
                                            <span className="bg-gray-800 px-2 py-1 rounded">ID: {center.id}</span>
                                            <span className={center.status === 'Active' ? 'text-emerald-400' : 'text-yellow-400'}>● {center.status}</span>
                                            <span>📊 {center.fill}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDelete(center.id, center.name)}
                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 p-2 px-4 rounded-lg transition-all text-sm font-bold opacity-0 group-hover:opacity-100"
                                        title="Permanently Delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;