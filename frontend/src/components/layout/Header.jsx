import React, { useState, useEffect } from 'react';
import { Bell, Search, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
// 🌟 STEP 1: Import the central config
import { API_BASE_URL } from '../../api_config';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [userData, setUserData] = useState({ name: "Arka", tokens: 0 });

  useEffect(() => {
    const fetchStatsAndProfile = async () => {
      try {
        // 🌟 STEP 2: Use the cloud URL
        const response = await fetch(`${API_BASE_URL}/api/user-stats`);
        const data = await response.json();
        
        let currentName = "Arka"; 
        const savedProfile = localStorage.getItem('wastehunters_profile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          currentName = parsedProfile.name.split(' ')[0]; 
        }

        setUserData({ name: currentName, tokens: data.tokens });
      } catch (error) {
        console.error("Could not fetch live data:", error);
      }
    };

    fetchStatsAndProfile();
    
    const interval = setInterval(fetchStatsAndProfile, 5000);
    return () => clearInterval(interval);
  }, [location]);

  const notifications = [
    {
      id: 1,
      title: "Pickup Scheduled",
      desc: "E-Waste pickup confirmed for Sector V tomorrow at 10 AM.",
      time: "2m ago",
      icon: CheckCircle,
      color: "text-waste-500",
      read: false
    },
    {
      id: 2,
      title: "Bonus Tokens",
      desc: "You earned +500 tokens for the 'Community Leader' badge!",
      time: "1h ago",
      icon: CheckCircle,
      color: "text-blue-400",
      read: false
    },
    {
      id: 3,
      title: "Hazard Alert",
      desc: "New guidelines for Lithium-ion battery disposal available.",
      time: "5h ago",
      icon: AlertTriangle,
      color: "text-orange-400",
      read: true
    }
  ];

  return (
    <header className="h-20 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-8 ml-64 fixed top-0 right-0 left-0 z-40">
      
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Welcome back,</span>
        <span className="text-white font-bold text-lg">{userData.name}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-dark-800 border border-dark-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-waste-500 w-64 transition-all"
            />
        </div>

        <div className="bg-waste-500/10 border border-waste-500/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_-5px_#10b981]">
            <div className="w-5 h-5 rounded-full bg-waste-500 flex items-center justify-center text-[10px] text-black font-bold">T</div>
            <span className="text-waste-500 font-bold text-sm">
                {userData.tokens.toLocaleString()} TOKENS
            </span>
        </div>

        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
            </button>

            {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.map((item) => (
                            <div key={item.id} className={`p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors flex gap-3 ${!item.read ? 'bg-waste-500/5' : ''}`}>
                                <item.icon className={`w-5 h-5 shrink-0 mt-0.5 ${item.color}`} />
                                <div>
                                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                                    <span className="text-[10px] text-gray-500 mt-2 block">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-dark-900 text-center">
                        <button className="text-xs text-waste-500 font-bold hover:text-waste-400">Mark all as read</button>
                    </div>
                </div>
            )}
        </div>

        <div 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-waste-400 to-blue-500 border-2 border-dark-800 cursor-pointer hover:border-waste-500 hover:scale-105 transition-all shadow-lg"
            title="Go to Profile"
        ></div>
      </div>
    </header>
  );
};

export default Header;