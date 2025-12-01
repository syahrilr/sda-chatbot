"use client";

import { Header } from '@/components/chatbot/header';
import { InputArea } from '@/components/chatbot/input-area';
import { MessagesContainer } from '@/components/chatbot/messages-container';
import { Sidebar } from '@/components/chatbot/sidebar';
import { useChatbot } from '@/hooks/use-chatbot';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function ChatbotPage() {
  const {
    chats,
    activeChat,
    input,
    setInput,
    isLoading,
    getCurrentChat,
    sendMessage,
    handleNewChat,
    handleDeleteChat,
    handleSelectChat
  } = useChatbot();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentChat = getCurrentChat();

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      /> */}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        <MessagesContainer
          messages={currentChat?.messages || []}
          isLoading={isLoading}
        />

        <InputArea
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSend={sendMessage}
        />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'bg-card text-card-foreground border-border',
            title: 'text-foreground',
            description: 'text-muted-foreground',
            actionButton: 'bg-primary text-primary-foreground',
            cancelButton: 'bg-muted text-muted-foreground',
          },
        }}
      />
    </div>
  );
}
