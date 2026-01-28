import React from 'react';
import { useChatStore } from '../../stores/chatStore';
import { Package, FileText, Phone, MoreVertical } from 'lucide-react';

const ChatHeader = () => {
  const { activeConversationId, getConversationPartner, getActiveConversationDetails } = useChatStore();
  // We might want to look up full order details here if needed, but the store has basic context
  
  if (!activeConversationId) return null;

  const partner = getConversationPartner(activeConversationId);
  const details = getActiveConversationDetails();

  if (!partner || !details) return null;

  return (
    <div className="h-16 border-b flex items-center justify-between px-6 bg-card text-card-foreground">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {partner.name.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm">{partner.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="capitalize bg-secondary px-1.5 rounded">{partner.role}</span>
            
            {details.contextType === 'order' && (
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <FileText size={10} /> Order #{details.contextIdx}
              </span>
            )}
            
            {details.contextType === 'delivery' && (
              <span className="flex items-center gap-1 text-orange-600 font-medium">
                <Package size={10} /> Delivery #{details.contextIdx}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors">
          <Phone size={18} />
        </button>
        <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
