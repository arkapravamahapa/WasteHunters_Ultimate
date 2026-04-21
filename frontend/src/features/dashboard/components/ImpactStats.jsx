import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ImpactStats = ({ totalKg }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChart = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/chart-data');
                if (response.ok) {
                    setChartData(await response.json());
                }
            } catch (error) {
                console.error("Failed to load chart", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChart();
    }, []);

    // Custom Tooltip to match the dark theme when hovering over the graph
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-300 font-bold mb-2">{label}</p>
                    <p className="text-emerald-400 text-sm">
                        Recycled: <span className="font-bold">{payload[1].value} kg</span>
                    </p>
                    <p className="text-blue-400 text-sm">
                        Carbon Saved: <span className="font-bold">{payload[0].value} kg</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800 shadow-lg">
            
            {/* Header matches your screenshot */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Environmental Impact</h3>
                    <div className="text-3xl font-black text-white flex items-center gap-2">
                        {totalKg} kg <span className="text-sm font-normal text-emerald-500">Recycled</span>
                    </div>
                </div>
                
                {/* Custom Legend */}
                <div className="flex gap-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Recycled
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Carbon Saved
                    </div>
                </div>
            </div>

            {/* The Recharts Area Chart */}
            <div className="h-64 w-full mt-4">
                {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center text-emerald-500 animate-pulse font-bold">
                        Loading metrics...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                {/* Green Gradient for Recycled */}
                                <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                {/* Blue Gradient for Carbon */}
                                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            
                            {/* Hidden grid lines (only horizontal dotted lines visible) */}
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            
                            {/* Axes styling */}
                            <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                            
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            
                            {/* Bottom Line (Carbon) */}
                            <Area type="monotone" dataKey="carbon" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                            
                            {/* Top Line (Recycled) */}
                            <Area type="monotone" dataKey="recycled" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRecycled)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ImpactStats;