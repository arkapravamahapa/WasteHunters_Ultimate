import React, { useState, useEffect } from 'react';
import { Zap, ArrowUpRight, Loader2 } from 'lucide-react';

// FIXED: Added '/components/' to the import paths
import ImpactStats from './components/ImpactStats'; 
import LiveFeedTicker from './components/LiveFeedTicker';
import { API_BASE_URL } from '../../api_config';

// 🌟 NEW: The Community Progress Bar Component
const CommunityProgress = ({ data }) => {
  if (!data) return null;
  
  // Calculate percentage, capping it at 100% just in case
  const percentage = Math.min((data.current_kg / data.target_kg) * 100, 100);
  
  return (
      <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 shadow-xl mb-6 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">{data.city} Community Goal</h3>
              <span className="text-waste-500 font-bold">{data.current_kg} / {data.target_kg} kg</span>
          </div>
          <div className="w-full h-4 bg-dark-900 rounded-full overflow-hidden border border-gray-800">
              <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-waste-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  style={{ width: `${percentage}%` }}
              ></div>
          </div>
          <p className="text-xs text-gray-500 mt-3 font-medium flex items-center gap-2">
              <span>🔥 Joined by <strong className="text-gray-300">{data.contributor_count} contributors</strong> this month.</span>
          </p>
      </div>
  );
};


const DashboardPage = () => {
  const [stats, setStats] = useState({ tokens: 0, events: 0 });
  const [centerStats, setCenterStats] = useState({ total: 0, active: 0 });
  
  // 🌟 NEW: State to hold the collective community goal data
  const [communityData, setCommunityData] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all required dashboard data in parallel
    const fetchDashboardData = async () => {
      try {
        // 🌟 UPDATED: Swapped hardcoded URLs for ${API_BASE_URL}
        const [statsRes, centersRes, communityRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/user-stats`),
          fetch(`${API_BASE_URL}/api/centers`),
          fetch(`${API_BASE_URL}/api/community-goal`) 
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        
        if (centersRes.ok) {
          const centersData = await centersRes.json();
          const activeCount = centersData.filter(center => center.status === 'Active').length;
          setCenterStats({ 
            total: centersData.length, 
            active: activeCount 
          });
        }

        // Save the community data
        if (communityRes.ok) setCommunityData(await communityRes.json());

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate a dynamic "kg processed" metric based on recycling events (e.g., 15.5kg per event)
  const totalKg = (stats.events * 15.5).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-waste-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time overview of recycling operations.</p>
        </div>
        
        {/* Quick Action Button - Routes to Hunter Tool */}
        <button 
          onClick={() => window.location.href = '/hunter'} 
          className="bg-waste-500 hover:bg-waste-600 text-dark-900 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_20px_-5px_#10b981]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Quick Scan</span>
        </button>
      </div>

      {/* 🌟 NEW: The Community Goal Progress Bar */}
      <CommunityProgress data={communityData} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Impact Graph & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pass dynamic kg down to the chart component */}
          <ImpactStats totalKg={totalKg} />
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-800 p-5 rounded-2xl border border-dark-700">
                <div className="text-gray-400 text-xs uppercase font-bold mb-2">Total Processed</div>
                <div className="text-2xl font-bold text-white flex items-end gap-2">
                    {totalKg} kg <span className="text-waste-500 text-xs mb-1 flex items-center bg-waste-500/10 px-1.5 py-0.5 rounded">+12% <ArrowUpRight className="w-3 h-3 ml-0.5"/></span>
                </div>
            </div>
            
            {/* Dynamic Live Database Centers Card */}
            <div className="bg-dark-800 p-5 rounded-2xl border border-dark-700">
                <div className="text-gray-400 text-xs uppercase font-bold mb-2">Active Centers</div>
                <div className="text-2xl font-bold text-white">
                    {centerStats.active} <span className="text-gray-500 text-sm font-normal">/ {centerStats.total}</span>
                </div>
            </div>
            
             <div className="bg-dark-800 p-5 rounded-2xl border border-dark-700 hidden md:block">
                <div className="text-gray-400 text-xs uppercase font-bold mb-2">Network Load</div>
                <div className="text-2xl font-bold text-waste-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-waste-500 animate-pulse"></span>
                    Optimal
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-1 h-full">
          <LiveFeedTicker />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;