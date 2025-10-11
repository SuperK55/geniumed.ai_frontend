import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-40 h-16 bg-white border-t border-gray-200">
      <div className="flex items-center justify-end px-6 h-full">
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="relative rounded-none hover:bg-transparent">
            <Bell className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">7</span>
            </span>
          </Button> */}

          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>

          {/* User Name and Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 px-2 py-4 h-auto hover:bg-gray-50 shadow-none">
                <span className="text-sm font-medium text-black">
                  {user?.name || ''}
                </span>
                <ChevronDown className="w-4 h-4 text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="rounded-lg hover:bg-gray-50 focus:bg-gray-50"
                onClick={handleProfileClick}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 rounded-lg hover:bg-red-50 focus:bg-red-50 hover:text-red-700 focus:text-red-700"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;