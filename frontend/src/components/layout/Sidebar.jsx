import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Map as MapIcon, 
  Gift, 
  BookOpen, 
  User, 
  Settings,
  Users // icons
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Camera, label: 'Hunter Tool', path: '/hunter' },
    { icon: MapIcon, label: 'Live Map', path: '/map' },
    { icon: Users, label: 'Community', path: '/community' }, // Add this line
    { icon: Gift, label: 'Rewards', path: '/rewards' },
    { icon: BookOpen, label: 'Education', path: '/education' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-dark-900 border-r border-dark-700 fixed left-0 top-0 z-50 flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          Waste<span className="text-waste-500">Hunters</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200
              ${isActive 
                ? 'bg-waste-500/10 text-waste-500 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
                : 'text-gray-500 hover:bg-dark-800 hover:text-gray-300'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 font-bold hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;