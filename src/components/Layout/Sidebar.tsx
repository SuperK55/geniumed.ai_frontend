import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  Users, 
  MessageSquare,
  Stethoscope,
  Heart,
  UserCheck
} from 'lucide-react';
import logo from '../../assets/imgs/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Voice Agents', href: '/voice-agents', icon: MessageSquare },
  { name: 'Doctors', href: '/doctors', icon: UserCheck },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Consultations', href: '/consultations', icon: Stethoscope },
];

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-100">
        <a href="/" className="flex items-center justify-center space-x-3">
          <img src={logo} alt="logo" className="w-auto h-16" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-primary hover:bg-blue-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;