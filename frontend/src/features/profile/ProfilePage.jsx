import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Calendar, Edit2, Share2, Award, History, Loader2, CheckCircle, X } from 'lucide-react';
import AchievementCard from './components/AchievementCard';
// 🌟 STEP 1: Import the central config
import { API_BASE_URL } from '../../api_config';

const ProfilePage = () => {
  const [stats, setStats] = useState({ tokens: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('wastehunters_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: "Arkaprava",
      handle: "@Genith_Arc",
      location: "New Town, Kolkata, West Bengal",
      email: "hunter@wastehunters.local",
      joined: "Jan 2026",
    };
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // 🌟 STEP 2: Use the cloud URL
    fetch(`${API_BASE_URL}/api/user-stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const history = [
    { id: 1, item: "Old Laptop Battery", date: "Feb 24, 2026", center: "Salt Lake Sector V Hub", tokens: "+150" },
    { id: 2, item: "Broken Monitor (CRT)", date: "Feb 10, 2026", center: "New Town Action Area I", tokens: "+400" },
    { id: 3, item: "Smartphone PCB", date: "Jan 28, 2026", center: "Eco Park Collection Point", tokens: "+50" },
  ];

  const elitePercent = Math.min((stats.events / 10) * 100, 100);
  const leaderPercent = Math.min((stats.events / 25) * 100, 100);
  const zeroWastePercent = Math.min((stats.events / 50) * 100, 100);

  const handleShareClick = () => {
    navigator.clipboard.writeText("KOL-99");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem('wastehunters_profile', JSON.stringify(editForm));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-waste-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 relative">
      <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-waste-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-waste-500 to-blue-500 p-1 shrink-0">
                <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-4 mb-1">
                    <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                    <span className="bg-waste-500/20 text-waste-500 text-xs font-bold px-3 py-1 rounded-full border border-waste-500/20">
                        Verified Hunter
                    </span>
                </div>
                <p className="text-gray-400 mb-4">{profile.handle}</p>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-waste-500" />{profile.location}</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-waste-500" />{profile.email}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-waste-500" />Joined {profile.joined}</div>
                </div>
            </div>

            <div className="bg-dark-900/50 border border-dark-700 p-4 rounded-2xl text-center min-w-[120px]">
                <div className="text-3xl font-bold text-waste-500">{stats.events}</div>
                <div className="text-xs text-gray-400 font-bold uppercase mt-1">Total Hunts</div>
            </div>
            
            <button 
                onClick={() => {
                  setEditForm(profile); 
                  setShowEditModal(true);
                }}
                className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
                <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-waste-500" /> 
                <h2 className="text-xl font-bold text-white">Achievements</h2>
            </div>
            
            <AchievementCard title="Elite Hunter" percent={Math.round(elitePercent)} color="bg-waste-500" />
            <AchievementCard title="Community Leader" percent={Math.round(leaderPercent)} color="bg-blue-500" />
            <AchievementCard title="Zero Waste Master" percent={Math.round(zeroWastePercent)} color="bg-purple-500" />
            
            <div className="bg-gradient-to-br from-waste-600 to-waste-800 p-6 rounded-2xl text-center shadow-lg mt-8">
                <h3 className="text-white font-bold text-lg mb-2">Refer a Friend</h3>
                <p className="text-waste-100 text-sm mb-4">Earn 500 tokens for every friend in Kolkata who recycles their first item.</p>
                <button 
                    onClick={handleShareClick}
                    className="bg-black text-waste-500 hover:text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    {copied ? <><CheckCircle className="w-4 h-4 text-green-500" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share Code: KOL-99</>}
                </button>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-waste-500" /> 
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            
            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                {history.map((item) => (
                    <div key={item.id} className="p-4 border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-waste-500 transition-all">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{item.item}</h4>
                                <p className="text-gray-500 text-sm">{item.center} • {item.date}</p>
                            </div>
                        </div>
                        <span className="text-waste-500 font-bold bg-waste-500/10 px-3 py-1 rounded-lg">
                            {item.tokens}
                        </span>
                    </div>
                ))}
                
                <div 
                  onClick={() => alert("Generating your full PDF recycling report...")}
                  className="p-4 bg-dark-900/50 text-center hover:bg-dark-700 transition-colors cursor-pointer"
                >
                    <button className="text-sm text-gray-400 hover:text-white font-medium">View Detailed Report</button>
                </div>
            </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-dark-900 border border-dark-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Display Name</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Username Handle</label>
                <input required type="text" value={editForm.handle} onChange={e => setEditForm({...editForm, handle: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location</label>
                <input required type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-waste-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-waste-500 hover:bg-waste-600 text-dark-900 font-bold py-4 rounded-xl mt-4 transition-all hover:scale-[1.02]">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;