import React, { useState, useEffect } from 'react';
import CampaignCard from './components/CampaignCard'; 
import { Plus, Search, Megaphone, Loader2, X } from 'lucide-react';
// 🌟 STEP 1: Import the central config
import { API_BASE_URL } from '../../api_config'; 

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('Explore');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedIds, setJoinedIds] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    max_volunteers: 20
  });

  const CURRENT_USER = "GreenHacker";

  useEffect(() => {
    fetchCampaigns();
    const savedJoins = JSON.parse(localStorage.getItem('wastehunters_joined') || '[]');
    setJoinedIds(savedJoins);
  }, []);

  const fetchCampaigns = async () => {
    try {
      // 🌟 STEP 2: Use the cloud URL
      const res = await fetch(`${API_BASE_URL}/api/campaigns`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      // 🌟 STEP 3: Use the cloud URL for the POST request
      const res = await fetch(`${API_BASE_URL}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          max_volunteers: parseInt(formData.max_volunteers),
          creator: CURRENT_USER
        }),
      });
      
      if (res.ok) {
        setShowCreateModal(false);
        setFormData({ title: '', location: '', date: '', max_volunteers: 20 });
        fetchCampaigns(); 
        setActiveTab('My Campaigns'); 
      }
    } catch (error) {
      console.error("Failed to create campaign", error);
    }
  };

  const handleJoinCampaign = (campaignId) => {
    const updatedJoins = [...joinedIds, campaignId];
    setJoinedIds(updatedJoins);
    localStorage.setItem('wastehunters_joined', JSON.stringify(updatedJoins));
    fetchCampaigns(); 
  };

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          camp.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'My Campaigns') return camp.creator === CURRENT_USER;
    if (activeTab === 'Joined') return joinedIds.includes(camp.id); 
    
    return true;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-waste-500" /> Community Campaigns
          </h1>
          <p className="text-gray-400 mt-1">Join forces with other Hunters in Kolkata to clean up our city.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-waste-500 hover:bg-waste-600 text-dark-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_#10b981] transition-all"
        >
          <Plus className="w-5 h-5" /> Start a Campaign
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-dark-700 pb-6">
        <div className="flex gap-6">
          {['Explore', 'My Campaigns', 'Joined'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold pb-2 transition-colors ${activeTab === tab ? 'text-waste-500 border-b-2 border-waste-500' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by area or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-waste-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-waste-500 w-10 h-10" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">
            No campaigns found. Why not start one?
          </div>
        ) : (
          filteredCampaigns.map(camp => (
            <CampaignCard 
              key={camp.id} 
              {...camp} 
              isAlreadyJoined={joinedIds.includes(camp.id)}
              onJoin={() => handleJoinCampaign(camp.id)} 
            />
          ))
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-dark-900 border border-dark-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Start New Campaign</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Campaign Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500" placeholder="e.g., Dumdum Park Cleanup" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500" placeholder="e.g., VIP Road" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500 style-color-scheme-dark" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Volunteers Needed</label>
                  <input required type="number" min="5" max="500" value={formData.max_volunteers} onChange={e => setFormData({...formData, max_volunteers: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-waste-500 hover:bg-waste-600 text-dark-900 font-bold py-4 rounded-xl mt-4 transition-all">
                Publish Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;