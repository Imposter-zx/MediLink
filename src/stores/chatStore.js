import { create } from 'zustand';
import { useAuthStore } from './authStore';

const MOCK_MESSAGES = [
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 'pharmacy-1',
    senderRole: 'pharmacy',
    receiverId: 'user-1',
    content: 'Your order #1024 is pending insurance approval.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'read'
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'user-1',
    senderRole: 'patient',
    receiverId: 'pharmacy-1',
    content: 'Okay, thanks for the update. How long does that usually take?',
    timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    status: 'read'
  },
  {
    id: 'm3',
    conversationId: 'c1',
    senderId: 'pharmacy-1',
    senderRole: 'pharmacy',
    receiverId: 'user-1',
    content: 'Usually 24-48 hours. We will notify you.',
    timestamp: new Date(Date.now() - 80000000).toISOString(),
    status: 'delivered'
  },
  {
    id: 'm4',
    conversationId: 'c2',
    senderId: 'driver-1',
    senderRole: 'delivery',
    receiverId: 'user-1',
    content: 'I am arriving with your delivery #DEL-8823 in 10 minutes.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'read'
  }
];

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    participants: ['user-1', 'pharmacy-1'],
    participantDetails: {
      'pharmacy-1': { name: 'Central Pharmacy', role: 'pharmacy' },
      'user-1': { name: 'Ilyass', role: 'patient' }
    },
    contextIdx: '1024',
    contextType: 'order',
    lastMessage: 'Usually 24-48 hours. We will notify you.',
    lastMessageAt: new Date(Date.now() - 80000000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'c2',
    participants: ['user-1', 'driver-1'],
    participantDetails: {
      'driver-1': { name: 'Mike (Driver)', role: 'delivery' },
      'user-1': { name: 'Ilyass', role: 'patient' }
    },
    contextIdx: 'DEL-8823',
    contextType: 'delivery',
    lastMessage: 'I am arriving with your delivery #DEL-8823 in 10 minutes.',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1
  }
];

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  searchTerm: '',

  // Initialize with mock data filtered by current user
  init: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Filter conversations where user is a participant
    const userConversations = MOCK_CONVERSATIONS.filter(c => 
      c.participants.includes(user.id)
    );

    set({ conversations: userConversations });
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
    get().fetchMessages(conversationId);
  },

  fetchMessages: (conversationId) => {
    set({ isLoading: true });
    // Simulate API delay
    setTimeout(() => {
      const msgs = MOCK_MESSAGES.filter(m => m.conversationId === conversationId);
      set({ messages: msgs, isLoading: false });
      
      // Mark as read logic would go here
      set(state => ({
        conversations: state.conversations.map(c => 
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      }));
    }, 500);
  },

  sendMessage: (content) => {
    const { activeConversationId, conversations } = get();
    const user = useAuthStore.getState().user;
    
    if (!activeConversationId || !user) return;

    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;

    // Find receiver (the other participant)
    const receiverId = conversation.participants.find(p => p !== user.id);
    
    const newMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user.id,
      senderRole: user.role,
      receiverId: receiverId,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    set(state => ({
      messages: [...state.messages, newMessage],
      conversations: state.conversations.map(c => 
        c.id === activeConversationId 
          ? { 
              ...c, 
              lastMessage: content, 
              lastMessageAt: newMessage.timestamp 
            } 
          : c
      )
    }));
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Helper to get display info for the other participant
  getConversationPartner: (conversationId) => {
    const { conversations } = get();
    const user = useAuthStore.getState().user;
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation || !user) return null;
    
    const partnerId = conversation.participants.find(p => p !== user.id);
    return conversation.participantDetails[partnerId];
  },

  getActiveConversationDetails: () => {
      const { conversations, activeConversationId } = get();
      return conversations.find(c => c.id === activeConversationId);
  }
}));
