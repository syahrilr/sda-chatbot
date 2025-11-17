import React from 'react';
import { Loader2 } from 'lucide-react';
import { Avatar } from './avatar';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 items-start animate-in fade-in duration-300">
      <Avatar type="bot" size="sm" />
      <div className="bg-secondary rounded-lg px-4 py-3 max-w-xs">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Sedang mengetik...</span>
        </div>
      </div>
    </div>
  );
};
