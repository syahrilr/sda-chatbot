import React from 'react';
import { Plus, MessageSquare, X, ChevronLeft } from 'lucide-react';
import type { Chat } from '@/lib/types/chat.types';
import { ChatItem } from './chat-item';

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-sidebar border-r border-sidebar-border
        flex flex-col transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64 max-w-xs
      `}>
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <h2 className="font-medium text-xs sm:text-sm text-sidebar-foreground">Riwayat</h2>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:block p-1.5 hover:bg-sidebar-accent rounded-md transition-colors duration-200"
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <ChevronLeft className={`w-5 h-5 text-sidebar-foreground transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 sm:p-1.5 hover:bg-sidebar-accent rounded-md transition-colors duration-200"
              >
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            </div>
          </div>
          {!isCollapsed && (
            <button
              onClick={onNewChat}
              className="w-full bg-primary text-primary-foreground rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors duration-200 font-medium text-xs sm:text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Chat Baru</span>
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={onNewChat}
              className="w-full bg-primary text-primary-foreground rounded-md p-2 flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
              title="Chat Baru"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5">
          {chats.length === 0 ? (
            !isCollapsed && (
              <div className="text-center py-8 text-sidebar-foreground/40">
                <MessageSquare className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2" />
                <p className="text-xs">Belum ada riwayat</p>
              </div>
            )
          ) : (
            chats.map((chat) => (
              isCollapsed ? (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full p-2.5 rounded-md transition-all duration-200 ${
                    activeChat === chat.id
                      ? 'bg-sidebar-primary/20'
                      : 'hover:bg-sidebar-accent'
                  }`}
                  title={chat.title}
                >
                  <MessageSquare className={`w-5 h-5 mx-auto transition-colors duration-200 ${
                    activeChat === chat.id ? 'text-sidebar-primary' : 'text-sidebar-foreground/50'
                  }`} />
                </button>
              ) : (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat === chat.id}
                  onSelect={() => onSelectChat(chat.id)}
                  onDelete={() => onDeleteChat(chat.id)}
                />
              )
            ))
          )}
        </div>
      </div>
    </>
  );
};
