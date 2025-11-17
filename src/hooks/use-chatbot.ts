import { useState, useEffect } from 'react';
import { Chat, Message } from '@/lib/types/chat.types';

export const useChatbot = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize first chat
  useEffect(() => {
    const initialChat: Chat = {
      id: '1',
      title: 'Chat Baru',
      messages: [{
        id: '1',
        text: 'Halo! Saya SDA Assistant. Ada yang bisa saya bantu?',
        sender: 'bot',
        timestamp: new Date()
      }],
      lastUpdated: new Date()
    };
    setChats([initialChat]);
    setActiveChat('1');
  }, []);

  const getCurrentChat = () => chats.find(c => c.id === activeChat);

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, title } : c
    ));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = input;
    setInput('');

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat) {
        const isFirstUserMessage = chat.messages.length === 1;
        if (isFirstUserMessage) {
          updateChatTitle(chat.id, currentInput);
        }
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          lastUpdated: new Date()
        };
      }
      return chat;
    }));

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.5.57:5678/webhook/chatbot-sda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await response.json();

      // Parse response - handle array or object format
      let botText = '';
      if (Array.isArray(data)) {
        // If response is array, get the output from first item
        botText = data[0]?.output || 'Maaf, saya tidak dapat memproses permintaan Anda.';
      } else {
        // If response is object
        botText = data.output || data.response || data.message || 'Maaf, saya tidak dapat memproses permintaan Anda.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, botMessage], lastUpdated: new Date() }
          : chat
      ));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan dalam menghubungi server.',
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Chat Baru',
      messages: [{
        id: Date.now().toString(),
        text: 'Halo! Saya SDA Assistant. Ada yang bisa saya bantu?',
        sender: 'bot',
        timestamp: new Date()
      }],
      lastUpdated: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (chatId === activeChat && filtered.length > 0) {
        setActiveChat(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
  };

  return {
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
  };
};
