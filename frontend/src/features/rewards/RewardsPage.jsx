import React, { useState, useEffect } from 'react';
import RewardCard from './components/RewardCard'; 
import { Sparkles, Loader2 } from 'lucide-react';
// 🌟 STEP 1: Import the central config
import { API_BASE_URL } from '../../api_config';

const rewards = [
  { id: 1, type: 'Voucher', title: 'Amazon Pay ₹500', desc: 'Redeem for eco-friendly products on Amazon India.', cost: 500, color: 'bg-gradient-to-br from-orange-500 to-yellow-600' },
  { id: 2, type: 'Gadget', title: 'Solar Power Bank', desc: '10,000mAh Made-in-India solar charger.', cost: 2500, color: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
  { id: 3, type: 'Merch', title: 'Kolkata Green Tee', desc: 'Recycled cotton t-shirt with city motifs.', cost: 1200, color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
];

const RewardsPage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Rewards');

  const fetchBalance = async () => {
    try {
      // 🌟 STEP 2: Use the cloud URL
      const res = await fetch(`${API_BASE_URL}/api/user-stats`);
      if (res.ok) {
        const data = await res.json();
        setBalance(data.tokens);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const filteredRewards = rewards.filter(reward => {
    if (activeTab === 'All Rewards') return true;
    if (activeTab === 'Vouchers') return reward.type === 'Voucher';
    if (activeTab === 'Gadgets') return reward.type === 'Gadget';
    if (activeTab === 'Merch') return reward.type === 'Merch';
    return false;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-waste-500 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_0_40px_-10px_#10b981]">
        <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-dark-900 mb-2">Redeem Rewards</h1>
            <p className="text-dark-800 font-medium max-w-lg">
                You've earned these tokens by keeping India clean. Spend them on vouchers and gadgets.
            </p>
        </div>
        <div className="bg-dark-900/20 backdrop-blur-sm p-6 rounded-2xl text-center border border-dark-900/10 min-w-[150px]">
            <span className="text-dark-900 text-xs font-bold uppercase tracking-wider">Current Balance</span>
            <div className="text-4xl font-bold text-white mt-1">
              {loading ? <Loader2 className="animate-spin w-8 h-8 mx-auto text-white" /> : balance.toLocaleString()}
            </div>
            <span className="text-xs font-bold text-dark-900 bg-white/30 px-2 py-0.5 rounded-full mt-2 inline-block">TOKENS</span>
        </div>
      </div>

      <div className="flex gap-4 border-b border-dark-700 pb-4 overflow-x-auto">
        {['All Rewards', 'Vouchers', 'Gadgets', 'Merch'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'text-waste-500 border-b-2 border-waste-500' : 'text-gray-400 hover:text-white'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
            <RewardCard 
              key={reward.id} 
              {...reward} 
              currentBalance={balance} 
              onRedeemSuccess={fetchBalance}
            />
        ))}
        <div className="bg-dark-800/50 rounded-2xl border border-dashed border-dark-700 flex flex-col items-center justify-center p-8 text-center group hover:border-waste-500/50 transition-colors">
            <Sparkles className="w-8 h-8 text-gray-600 mb-2 group-hover:text-waste-500 transition-colors" />
            <span className="text-gray-500 font-medium">More Indian Brands coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;