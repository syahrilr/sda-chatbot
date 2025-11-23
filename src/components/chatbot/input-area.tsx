import React, { useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '../ui/button';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  isLoading,
  onSend
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  return (
    <div className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent pt-6 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative bg-card rounded-2xl border-2 border-input focus-within:border-ring transition-all duration-200 shadow-lg hover:shadow-xl">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tanyakan tentang data SDA..."
            disabled={isLoading}
            rows={1}
            className="w-full px-5 py-4 pr-14 rounded-2xl resize-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            style={{
              minHeight: '56px',
              maxHeight: '200px'
            }}
          />

          <Button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-3 bottom-3 rounded-xl"
            title={isLoading ? "Mengirim..." : "Kirim pesan"}
          >
            {isLoading ? (
              <Square className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 px-2">
          <p className="text-xs text-muted-foreground text-center">
            <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono">Enter</kbd> untuk kirim
            <span className="mx-2">•</span>
            <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono">Shift + Enter</kbd> untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
};
