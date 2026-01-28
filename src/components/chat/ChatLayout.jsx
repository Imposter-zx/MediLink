import React from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { useChatStore } from '../../stores/chatStore';

const ChatLayout = () => {
  const { activeConversationId } = useChatStore();

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-background border rounded-xl shadow-sm overflow-hidden m-0 md:m-4">
      {/* Sidebar - hidden on mobile when conversation is active */}
      <div className={`w-full md:w-80 lg:w-96 border-r flex-shrink-0 bg-card ${
        activeConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        <ChatList />
      </div>

      {/* Main Window - hidden on mobile when NO conversation is active */}
      <div className={`flex-1 flex flex-col min-w-0 bg-background ${
        !activeConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatLayout;
