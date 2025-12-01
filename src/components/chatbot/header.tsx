import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Avatar } from './avatar';
import { ThemeSwitcher } from '../mode-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button> */}

          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar type="bot" size="md" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 dark:bg-green-400 border-2 border-card rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-foreground truncate">
                  SDA Assistant
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </div>
          </div>

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};
