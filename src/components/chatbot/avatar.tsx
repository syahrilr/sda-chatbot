import React from 'react';
import { Bot, User } from 'lucide-react';

interface AvatarProps {
  type: 'user' | 'bot';
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ type, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (type === 'bot') {
    return (
      <div className={`${sizeClasses[size]} bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm shrink-0 ring-2 ring-primary/20`}>
        <Bot className={`${iconSizes[size]} text-primary-foreground`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-linear-to-br from-muted to-muted/60 rounded-lg flex items-center justify-center shadow-sm shrink-0`}>
      <User className={`${iconSizes[size]} text-muted-foreground`} />
    </div>
  );
};
