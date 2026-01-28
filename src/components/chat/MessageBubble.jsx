import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const { user } = useAuthStore();
  const isOwn = message.senderId === user?.id;

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl relative shadow-sm ${
          isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-none' 
            : 'bg-secondary text-secondary-foreground rounded-bl-none'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-1 opacity-70 capitalize">
            {message.senderRole}
          </p>
        )}
        
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          <span className="text-[10px]">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span>
              {message.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
