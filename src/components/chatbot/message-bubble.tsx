import React, { useState } from 'react';
import type { Message } from '@/lib/types/chat.types';
import { Avatar } from './avatar';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ChartRenderer } from './chart-renderer';
import { Button } from '../ui/button';

interface MessageBubbleProps {
  message: Message;
}

const FormattedBotMessage: React.FC<{ text: string }> = ({ text }) => {
  // Deteksi Chart JSON
  const chartRegex = /```json:chart\s*([\s\S]*?)```/g;
  const chartMatches = Array.from(text.matchAll(chartRegex));

  if (chartMatches.length > 0) {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    chartMatches.forEach((match, idx) => {
      if (match.index! > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <div key={`text-${idx}`} className="mb-4">
              <FormattedTextContent text={textBefore} />
            </div>
          );
        }
      }

      parts.push(
        <ChartRenderer key={`chart-${idx}`} configString={match[0]} />
      );

      lastIndex = match.index! + match[0].length;
    });

    if (lastIndex < text.length) {
      const textAfter = text.substring(lastIndex);
      if (textAfter.trim()) {
        parts.push(
          <div key="text-after" className="mt-4">
            <FormattedTextContent text={textAfter} />
          </div>
        );
      }
    }

    return <div>{parts}</div>;
  }

  return <FormattedTextContent text={text} />;
};

const FormattedTextContent: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentSection: string[] = [];

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();

    // Header dengan emoji (## 🔍, ## 📊, dll)
    if (trimmedLine.match(/^##\s*[🔍📊💡🛠️⚠️]/)) {
      if (currentSection.length > 0) {
        elements.push(<div key={`section-${idx}`} className="mb-4">{renderSection(currentSection)}</div>);
        currentSection = [];
      }

      const headerText = trimmedLine.replace(/^##\s*/, '');
      let className = 'bg-muted/50 border-l-4 border-border';

      if (headerText.includes('🔍')) {
        className = 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500';
      } else if (headerText.includes('📊')) {
        className = 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500';
      } else if (headerText.includes('💡')) {
        className = 'bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500';
      } else if (headerText.includes('🛠️')) {
        className = 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500';
      } else if (headerText.includes('⚠️')) {
        className = 'bg-destructive/10 border-l-4 border-destructive';
      }

      elements.push(
        <div key={`header-${idx}`} className={`${className} px-4 py-2.5 my-4 rounded-r-lg`}>
          <h3 className="text-base font-semibold text-foreground">{headerText}</h3>
        </div>
      );
      return;
    }

    // Sub-header (###)
    if (trimmedLine.match(/^###\s+/)) {
      if (currentSection.length > 0) {
        elements.push(<div key={`section-${idx}`} className="mb-3">{renderSection(currentSection)}</div>);
        currentSection = [];
      }

      const subHeaderText = trimmedLine.replace(/^###\s+/, '');
      elements.push(
        <h4 key={`subheader-${idx}`} className="text-sm font-semibold text-foreground mt-4 mb-2 flex items-center">
          <div className="w-1 h-4 bg-primary mr-2 rounded-full"></div>
          {subHeaderText}
        </h4>
      );
      return;
    }

    // Blockquote (>)
    if (trimmedLine.startsWith('>')) {
      if (currentSection.length > 0) {
        elements.push(<div key={`section-${idx}`} className="mb-3">{renderSection(currentSection)}</div>);
        currentSection = [];
      }

      const quoteText = trimmedLine.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${idx}`} className="border-l-3 border-primary bg-primary/5 px-4 py-2.5 my-2 rounded-r">
          <p className="text-sm text-muted-foreground leading-relaxed italic">{renderInlineFormatting(quoteText)}</p>
        </div>
      );
      return;
    }

    // Separator (---)
    if (trimmedLine === '---') {
      if (currentSection.length > 0) {
        elements.push(<div key={`section-${idx}`} className="mb-3">{renderSection(currentSection)}</div>);
        currentSection = [];
      }
      elements.push(<div key={`sep-${idx}`} className="h-px bg-linear-to-r from-transparent via-border to-transparent my-6"></div>);
      return;
    }

    // Akumulasi text biasa dan list items
    if (trimmedLine) {
      currentSection.push(line);
    } else if (currentSection.length > 0) {
      elements.push(<div key={`section-${idx}`} className="mb-3">{renderSection(currentSection)}</div>);
      currentSection = [];
    }
  });

  if (currentSection.length > 0) {
    elements.push(<div key="final-section" className="mb-3">{renderSection(currentSection)}</div>);
  }

  return <div className="space-y-1">{elements}</div>;
};

const renderSection = (lines: string[]) => {
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();

    // List item
    if (trimmedLine.match(/^(\d+\.|[-*]|[✅⚠️🔧📞🚨📈⏱️📝🆘🚑🚧🔄⚡])\s+/)) {
      const match = trimmedLine.match(/^(\d+\.|[-*]|[✅⚠️🔧📞🚨📈⏱️📝🆘🚑🚧🔄⚡])\s+(.+)/);
      if (match) {
        const marker = match[1];
        const content = match[2];

        elements.push(
          <div key={idx} className="flex items-start gap-2.5 mb-2 group">
            <span className="text-sm text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground transition-colors">
              {marker}
            </span>
            <span className="text-sm text-foreground leading-relaxed flex-1">
              {renderInlineFormatting(content)}
            </span>
          </div>
        );
      }
      return;
    }

    // Text biasa
    if (trimmedLine) {
      elements.push(
        <p key={idx} className="text-sm text-foreground leading-relaxed mb-2">
          {renderInlineFormatting(trimmedLine)}
        </p>
      );
    }
  });

  return <>{elements}</>;
};

const renderInlineFormatting = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return <span key={idx}>{part}</span>;
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      toast.success('Pesan berhasil disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Gagal menyalin pesan');
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500`}>
      <Avatar type={message.sender} size="sm" />

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-5xl flex-1 group`}>
        <div
          className={`rounded-lg px-4 py-3 transition-all duration-200 relative w-full ${
            isUser
              ? 'bg-primary text-primary-foreground ml-12'
              : 'bg-card text-card-foreground border border-border hover:border-primary/20 hover:shadow-sm mr-12'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          ) : (
            <FormattedBotMessage text={message.text} />
          )}

          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute -bottom-9 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8"
              title="Salin pesan"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1.5 px-1">
          {message.timestamp.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};
