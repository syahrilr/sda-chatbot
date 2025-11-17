import React, { useRef, useEffect } from 'react';
import type { Message } from '@/lib/types/chat.types';
import { MessageBubble } from './message-bubble';
import { LoadingIndicator } from './loading-indicator';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyAllMessages = async () => {
    const allText = messages
      .map(msg => {
        const sender = msg.sender === 'user' ? 'Anda' : 'SDA Assistant';
        return `${sender}:\n${msg.text}`;
      })
      .join('\n\n---\n\n');

    try {
      await navigator.clipboard.writeText(allText);
      toast.success('Semua pesan berhasil disalin', { duration: 2000 });
    } catch (err) {
      toast.error('Gagal menyalin pesan', { duration: 2000 });
    }
  };

  const handleDownloadChat = () => {
    const allText = messages
      .map(msg => {
        const sender = msg.sender === 'user' ? 'Anda' : 'SDA Assistant';
        const time = msg.timestamp.toLocaleString('id-ID');
        return `[${time}] ${sender}:\n${msg.text}`;
      })
      .join('\n\n---\n\n');

    const element = document.createElement('a');
    const file = new Blob([allText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Chat berhasil diunduh', { duration: 2000 });
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {messages.length > 1 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleCopyAllMessages}
              className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-secondary text-foreground border border-border/30 hover:bg-muted transition-colors duration-200"
              title="Salin semua pesan"
            >
              <Copy className="w-4 h-4 shrink-0" />
              <span>Salin Semua</span>
            </button>
            <button
              onClick={handleDownloadChat}
              className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-secondary text-foreground border border-border/30 hover:bg-muted transition-colors duration-200"
              title="Unduh chat"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Unduh</span>
            </button>
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
