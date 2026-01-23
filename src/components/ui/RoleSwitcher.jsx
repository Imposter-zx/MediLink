import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Pill, Truck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

/**
 * RoleSwitcher - Development tool to switch between roles
 * This allows testing different dashboards without re-logging in
 */
const RoleSwitcher = () => {
  const { user, login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  if (!isAuthenticated) return null;
  
  const roles = [
    { id: 'patient', name: 'Patient', icon: User, path: '/patient' },
    { id: 'pharmacy', name: 'Pharmacy', icon: Pill, path: '/pharmacy' },
    { id: 'delivery', name: 'Delivery', icon: Truck, path: '/delivery' },
  ];
  
  const handleRoleChange = (roleId, path) => {
    login({
      userData: {
        id: user.id,
        name: user.name,
        role: roleId,
      }
    });
    navigate(path);
  };
  
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = user.role === role.id;
        
        return (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id, role.path)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            )}
            title={`Switch to ${role.name}`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{role.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitcher;
