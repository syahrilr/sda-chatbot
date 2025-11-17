'use client';

import { Header } from '@/components/chatbot/header';
import { InputArea } from '@/components/chatbot/input-area';
import { MessagesContainer } from '@/components/chatbot/messages-container';
import { Sidebar } from '@/components/chatbot/sidebar';
import { useChatbot } from '@/hooks/use-chatbot';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function SdaChatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const currentChat = getCurrentChat();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={(id) => {
          handleSelectChat(id);
          setSidebarOpen(false);
        }}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {currentChat ? (
          <>
            <MessagesContainer
              messages={currentChat.messages}
              isLoading={isLoading}
            />
            <InputArea
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              onSend={sendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-sm">Pilih atau buat chat baru untuk memulai</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
