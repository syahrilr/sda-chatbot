import React from 'react';
import { Send } from 'lucide-react';

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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-background border-t border-border/40">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              rows={1}
              disabled={isLoading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-foreground placeholder:text-muted-foreground text-sm"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-medium shadow-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 group active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            <span className="hidden sm:inline text-sm">Kirim</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left px-1">
          Enter untuk mengirim • Shift + Enter untuk baris baru
        </p>
      </div>
    </div>
  );
};
