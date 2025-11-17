import React from 'react';
import { Menu } from 'lucide-react';
import { Avatar } from './avatar';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="bg-background border-b border-border/40 sticky top-0 z-40">
      <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-accent rounded-lg transition-colors duration-200 shrink-0"
          >
            <Menu className="w-5 h-5 sm:w-5 text-foreground" />
          </button>
          <Avatar type="bot" size="md" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
              SDA Assistant
            </h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
};
