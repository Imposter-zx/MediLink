import React, { useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const ChatList = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    searchTerm, 
    setSearchTerm,
    init
  } = useChatStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    init();
  }, [init, user]); // Re-init if user changes

  const filteredConversations = conversations.filter(c => {
    const partnerId = c.participants.find(p => p !== user?.id);
    const partner = c.participantDetails[partnerId];
    return partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full border-r bg-card/50">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border-none rounded-xl focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No conversations found.
          </div>
        ) : (
          filteredConversations.map(conversation => {
            const partnerId = conversation.participants.find(p => p !== user?.id);
            const partner = conversation.participantDetails[partnerId];
            const isActive = conversation.id === activeConversationId;

            return (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors border-b border-border/50 ${
                  isActive ? 'bg-secondary/80 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {partner.name.charAt(0)}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full border-2 border-background font-bold">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-foreground' : 'text-foreground/90'}`}>
                      {partner.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium capitalize">
                      {partner.role}
                    </span>
                    {conversation.contextType === 'order' && (
                       <span className="text-[10px] text-muted-foreground">#Ord-{conversation.contextIdx}</span>
                    )}
                  </div>

                  <p className={`text-xs truncate ${conversation.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
