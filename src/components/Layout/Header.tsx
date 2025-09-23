import React from 'react';
import { Bell, Settings, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  return (
    <header className="fixed top-0 left-64 right-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-end px-6 h-full">
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">24</div>
              <div className="text-xs text-gray-500">Today's Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary">12</div>
              <div className="text-xs text-gray-500">Pending Follow-ups</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-accent">3</div>
              <div className="text-xs text-gray-500">Urgent Cases</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">DS</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">Dr. Smith</div>
                  <div className="text-xs text-gray-500">Cardiologist</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-200">
              <DropdownMenuItem className="rounded-lg">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 rounded-lg">
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