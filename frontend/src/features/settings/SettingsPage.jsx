import React, { useState } from 'react';
import { Bell, Shield, Moon, Globe, LogOut, ChevronRight, MapPin, Smartphone } from 'lucide-react';

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-waste-500' : 'bg-dark-700'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    alert("Logging out... (This would clear your session and redirect to login)");
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your app preferences and account settings.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            <div className="p-6 border-b border-dark-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-waste-500" /> App Preferences
                </h2>
            </div>
            <div className="p-2">
                <div className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors">
                    <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-400">Reduce eye strain and save battery</p>
                    </div>
                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors">
                    <div>
                        <p className="text-white font-medium">Language</p>
                        <p className="text-sm text-gray-400">Choose your preferred language</p>
                    </div>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        English <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors">
                    <div>
                        <p className="text-white font-medium">Location Services</p>
                        <p className="text-sm text-gray-400">Required for Live Map and local campaigns</p>
                    </div>
                    <Toggle enabled={locationServices} onChange={() => setLocationServices(!locationServices)} />
                </div>
            </div>
        </div>

        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            <div className="p-6 border-b border-dark-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-waste-500" /> Notifications
                </h2>
            </div>
            <div className="p-2">
                <div className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors">
                    <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-400">Get alerted about nearby cleanup drives</p>
                    </div>
                    <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors">
                    <div>
                        <p className="text-white font-medium">Email Alerts</p>
                        <p className="text-sm text-gray-400">Receive weekly impact reports and rewards</p>
                    </div>
                    <Toggle enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                </div>
            </div>
        </div>

        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            <div className="p-6 border-b border-dark-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-waste-500" /> Account Security
                </h2>
            </div>
            <div className="p-2">
                <div onClick={() => alert("Change password flow coming soon!")} className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors cursor-pointer group">
                    <div>
                        <p className="text-white font-medium group-hover:text-waste-400 transition-colors">Change Password</p>
                        <p className="text-sm text-gray-400">Update your account password</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-waste-400 transition-colors" />
                </div>
                <div onClick={() => alert("Privacy policy document opening...")} className="flex items-center justify-between p-4 hover:bg-dark-700/50 rounded-xl transition-colors cursor-pointer group">
                    <div>
                        <p className="text-white font-medium group-hover:text-waste-400 transition-colors">Privacy Policy</p>
                        <p className="text-sm text-gray-400">Review how we handle your data</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-waste-400 transition-colors" />
                </div>
            </div>
        </div>

        <div className="pt-4">
            <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <LogOut className="w-5 h-5" /> Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;