import React from 'react';
import { Plus, MessageSquare, X, PanelLeftClose, PanelLeft, Trash2 } from 'lucide-react';
import type { Chat } from '@/lib/types/chat.types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50",
        "bg-sidebar border-r border-sidebar-border",
        "flex flex-col transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-72",
        "w-72 shadow-xl lg:shadow-none"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <h2 className="font-semibold text-sm text-sidebar-foreground">Riwayat Chat</h2>
            )}
            <div className="flex items-center gap-1 ml-auto">
              {/* Toggle Collapse Button - Desktop Only */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden lg:flex h-8 w-8"
                title={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
              >
                {isCollapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>

              {/* Close Button - Mobile Only */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          {!isCollapsed ? (
            <Button
              onClick={onNewChat}
              className="w-full gap-2"
              size="default"
            >
              <Plus className="h-4 w-4" />
              <span>Chat Baru</span>
            </Button>
          ) : (
            <Button
              onClick={onNewChat}
              size="icon"
              className="w-full"
              title="Chat Baru"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            !isCollapsed && (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Belum ada riwayat</p>
                <p className="text-xs text-muted-foreground mt-1">Mulai chat baru untuk memulai</p>
              </div>
            )
          ) : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChat === chat.id}
                isCollapsed={isCollapsed}
                onSelect={() => onSelectChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p className="font-medium">SDA Assistant v1.0</p>
              <p>Powered by AI</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Chat Item Component
interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  isCollapsed: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  isCollapsed,
  onSelect,
  onDelete
}) => {
  const [showDelete, setShowDelete] = React.useState(false);

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onSelect}
        className={cn(
          "w-full h-12 transition-all duration-200",
          isActive && "bg-sidebar-accent text-sidebar-primary"
        )}
        title={chat.title}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
        isActive
          ? "bg-sidebar-accent border border-sidebar-primary/20"
          : "hover:bg-sidebar-accent border border-transparent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3 min-w-0">
        <MessageSquare className={cn(
          "w-4 h-4 shrink-0 mt-0.5 transition-colors duration-200",
          isActive ? "text-sidebar-primary" : "text-muted-foreground"
        )} />
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-sm truncate transition-colors duration-200",
            isActive ? "text-sidebar-primary" : "text-sidebar-foreground"
          )}>
            {chat.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chat.lastUpdated.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short'
            })}
          </p>
        </div>
        {showDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="shrink-0 h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
            title="Hapus chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
