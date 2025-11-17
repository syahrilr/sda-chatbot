import React, { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { Chat } from '@/lib/types/chat.types';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onDelete
}) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={`
        group relative p-3 rounded-md cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-sidebar-primary/15'
          : 'hover:bg-sidebar-accent'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 transition-colors duration-200 ${
          isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50'
        }`} />
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm truncate transition-colors duration-200 ${
            isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'
          }`}>
            {chat.title}
          </h3>
          <p className="text-xs text-sidebar-foreground/40 mt-0.5">
            {chat.lastUpdated.toLocaleDateString('id-ID')}
          </p>
        </div>
        {showDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="shrink-0 p-1 hover:bg-red-100 rounded transition-colors duration-200 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
