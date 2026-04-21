import React, { useState } from 'react';
import { Users, Calendar, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
// 🌟 STEP 1: Import the central config (Note the path depth)
import { API_BASE_URL } from '../../../../api_config';

const CampaignCard = ({ id, title, location, date, volunteers, max_volunteers, creator, onJoin, isAlreadyJoined }) => {
  const [isJoining, setIsJoining] = useState(false);
  
  const progress = (volunteers / max_volunteers) * 100;
  const isFull = volunteers >= max_volunteers;

  const handleJoin = async () => {
    if (isFull || isAlreadyJoined) return;
    
    setIsJoining(true);
    try {
      // 🌟 STEP 2: Use the cloud URL
      const res = await fetch(`${API_BASE_URL}/api/campaigns/${id}/join`, {
        method: 'POST',
      });
      
      if (res.ok) {
        onJoin(); 
      }
    } catch (error) {
      console.error("Error joining campaign", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 hover:border-waste-500 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-waste-400 transition-colors">{title}</h3>
        <span className="text-[10px] font-bold bg-waste-500/10 text-waste-500 px-2 py-1 rounded-full border border-waste-500/20">
          Active
        </span>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4 text-waste-500" /> {location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4 text-waste-500" /> {date}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4 text-waste-500" /> Organized by <span className="text-white font-medium">{creator}</span>
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-500 uppercase">Volunteer Progress</span>
          <span className="text-waste-500">{volunteers}/{max_volunteers}</span>
        </div>
        <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
          <div className="h-full bg-waste-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
      </div>

      <button 
        onClick={handleJoin}
        disabled={isJoining || isAlreadyJoined || isFull}
        className={`w-full mt-6 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all 
            ${isAlreadyJoined ? 'bg-waste-500/10 text-waste-500 border border-waste-500/50' : 
              isFull ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 
              'bg-white hover:bg-waste-50 text-dark-900'}`}
      >
        {isJoining ? 'Joining...' : 
         isAlreadyJoined ? <><CheckCircle className="w-4 h-4" /> Joined</> : 
         isFull ? 'Campaign Full' : 
         <><ArrowRight className="w-4 h-4" /> Join Campaign</>}
      </button>
    </div>
  );
};

export default CampaignCard;