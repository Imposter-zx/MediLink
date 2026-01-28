import React, { useEffect } from 'react';
import ChatLayout from '../components/chat/ChatLayout';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // RBAC logic is handled by ProtectedRoute in routes/index.jsx
    // and data filtering is handled by chatStore.init()
  }, [user, navigate]);

  return (
    <div className="h-full w-full bg-slate-50/50 dark:bg-background/50 p-0 md:p-2">
      <ChatLayout />
    </div>
  );
};

export default Messages;
