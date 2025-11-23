import React, { useRef, useEffect } from 'react';
import type { Message } from '@/lib/types/chat.types';
import { MessageBubble } from './message-bubble';
import { LoadingIndicator } from './loading-indicator';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

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
      toast.success('Semua pesan berhasil disalin');
    } catch (err) {
      toast.error('Gagal menyalin pesan');
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
    element.download = `chat-sda-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Chat berhasil diunduh');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-linear-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {messages.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAllMessages}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Semua</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadChat}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Chat</span>
            </Button>
          </div>
        )}

        <div>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};
