import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import { Send, Paperclip, Smile } from 'lucide-react';

const ChatWindow = () => {
  const { activeConversationId, messages, sendMessage, isLoading } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversationId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background/50 text-muted-foreground h-full">
        <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Send size={32} className="opacity-50 ml-1" />
        </div>
        <h3 className="text-lg font-medium">Select a conversation</h3>
        <p className="text-sm opacity-70">Choose a contact to start messaging securely.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 dark:bg-background/20">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-card border-t mt-auto">
        <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
          <button 
            type="button" 
            className="p-3 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 bg-secondary/50 rounded-2xl border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your secure message..."
              className="w-full bg-transparent border-none px-4 py-3 max-h-32 min-h-[48px] focus:ring-0 resize-none text-sm md:text-base scrollbar-hide"
              rows={1}
            />
          </div>

          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send size={20} className={inputValue.trim() ? "ml-1" : ""} />
          </button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Messages are end-to-end encrypted and HIPAA compliant.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
