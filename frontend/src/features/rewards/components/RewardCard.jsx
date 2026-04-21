import React, { useState } from 'react';
import { Gift, ArrowRight, CheckCircle, Lock } from 'lucide-react';
// 🌟 Import Config
import { API_BASE_URL } from '../../../api_config';
const RewardCard = ({ type, title, desc, cost, color, currentBalance, onRedeemSuccess }) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const canAfford = currentBalance >= cost;

  const handleRedeem = async () => {
    if (!canAfford || isRedeemed) return;
    
    setIsRedeeming(true);
    try {
      // 🌟 Use Cloud URL
      const res = await fetch(`${API_BASE_URL}/api/redeem-tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost: cost }),
      });
      
      if (res.ok) {
        setIsRedeemed(true);
        onRedeemSuccess(); 
        alert(`🎉 Success! You've redeemed: ${title}.`);
      }
    } catch (error) {
      console.error("Error redeeming token", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className={`bg-dark-800 rounded-2xl border ${canAfford ? 'border-dark-700 hover:border-waste-500' : 'border-dark-700 opacity-75'} overflow-hidden group transition-all duration-300`}>
      <div className={`h-40 ${color} relative flex items-center justify-center`}>
        <Gift className="w-12 h-12 text-white/50 group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
            {type}
        </span>
        {!canAfford && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <Lock className="w-8 h-8 text-white/50" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col h-[180px]">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{desc}</p>
        <div className="flex items-center justify-between mt-auto">
            <span className={`${canAfford ? 'text-waste-500' : 'text-gray-500'} font-bold font-mono`}>
              {cost} TOKENS
            </span>
            <button 
              onClick={handleRedeem}
              disabled={!canAfford || isRedeeming || isRedeemed}
              className={`text-sm font-bold flex items-center gap-1 transition-colors ${isRedeemed ? 'text-waste-500' : !canAfford ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:text-waste-400'}`}
            >
                {isRedeeming ? 'Processing...' : isRedeemed ? 'Redeemed' : 'Redeem'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;