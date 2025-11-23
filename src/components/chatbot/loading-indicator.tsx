import React from 'react';
import { Avatar } from './avatar';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 items-start mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <Avatar type="bot" size="sm" />
      <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-muted-foreground ml-1">Sedang berpikir...</span>
        </div>
      </div>
    </div>
  );
};
