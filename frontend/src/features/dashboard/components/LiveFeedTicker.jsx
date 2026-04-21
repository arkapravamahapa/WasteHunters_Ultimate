import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
// 🌟 Import Config
import { API_BASE_URL } from '../../../../api_config';

const LiveFeedTicker = () => {
    const [feedData, setFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // 🌟 Use Cloud URL
                const response = await fetch(`${API_BASE_URL}/api/live-feed`);
                if (response.ok) {
                    setFeedData(await response.json());
                }
            } catch (error) {
                console.error("Failed to load feed", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeed();
        const interval = setInterval(fetchFeed, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">Live Network Feed</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {isLoading ? (
                    <p className="text-gray-500 text-sm animate-pulse">Connecting to global network...</p>
                ) : (
                    feedData.map((item) => (
                        <div key={item.id} className="bg-dark-900 border border-dark-700 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
                            <p className="text-sm text-gray-300">
                                <strong className="text-white">{item.user}</strong> {item.action} at <span className="text-blue-400 font-medium">{item.hub}</span>.
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                                <Clock className="w-3 h-3" />
                                {item.time}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiveFeedTicker;