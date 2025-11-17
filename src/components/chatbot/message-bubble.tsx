import React, { useState } from 'react';
import type { Message } from '@/lib/types/chat.types';
import { Avatar } from './avatar';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

const FormattedBotMessage: React.FC<{ text: string }> = ({ text }) => {
  const sections = text.split(/(?=\d+[️⃣\s]*[\*\*]*[A-Z])/);

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        if (!section.trim()) return null;

        const lines = section.split('\n').filter(line => line.trim());

        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              if (line.match(/^\d+[️⃣\s]*\*\*.*\*\*/) || line.match(/^\d+[️⃣\s]*[A-Z]/)) {
                return (
                  <div key={lineIdx} className="mb-2">
                    <div className="flex items-start gap-2 bg-primary/10 rounded-md px-3 py-2 border-l-3 border-primary">
                      <span className="font-semibold text-primary text-xs sm:text-sm leading-relaxed">
                        {line.replace(/\*\*/g, '')}
                      </span>
                    </div>
                  </div>
                );
              }

              if (line.includes('**')) {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={lineIdx} className="text-xs sm:text-sm leading-relaxed text-foreground">
                    {parts.map((part, partIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={partIdx}>{part}</span>;
                    })}
                  </p>
                );
              }

              if (line.includes('|') && line.split('|').length > 2) {
                return null;
              }

              if (line.trim()) {
                return <p key={lineIdx} className="text-xs sm:text-sm leading-relaxed text-foreground">{line}</p>;
              }
              return null;
            })}

            {section.includes('|') && (
              <div className="overflow-x-auto my-3 -mx-2 px-2">
                <table className="min-w-full text-xs border-collapse bg-background rounded-md overflow-hidden border border-border">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      {section.split('\n')
                        .find(line => line.includes('|') && !line.includes('---'))
                        ?.split('|')
                        .filter(cell => cell.trim())
                        .map((header, i) => (
                          <th key={i} className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-semibold text-foreground text-xs">
                            {header.trim()}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.split('\n')
                      .filter(line => line.includes('|') && !line.includes('---'))
                      .slice(1)
                      .map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
                          {row.split('|')
                            .filter(cell => cell.trim())
                            .map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-2 sm:px-3 py-1.5 sm:py-2 text-muted-foreground text-xs">
                                {cell.trim()}
                              </td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      toast('Pesan berhasil disalin', { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast('Gagal menyalin pesan', { duration: 2000 });
    }
  };

  return (
    <div className={`flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <Avatar type={message.sender} size="sm" />

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-sm md:max-w-7xl group`}>
        <div
          className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 relative shadow-sm text-sm sm:text-base ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-foreground border border-border/30'
          }`}
        >
          {isUser ? (
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          ) : (
            <FormattedBotMessage text={message.text} />
          )}

          <button
            onClick={handleCopy}
            className="absolute -bottom-8 sm:-bottom-9 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30"
            title="Salin pesan"
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <span className="text-xs text-muted-foreground mt-2 px-2">
          {message.timestamp.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};
