import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'info' // info, success, warning, danger
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    info: {
      icon: <AlertCircle className="text-primary" size={24} />,
      btnClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      iconBg: 'bg-primary/10'
    },
    success: {
        icon: <CheckCircle2 className="text-primary" size={24} />,
        btnClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
        iconBg: 'bg-primary/10'
    },
    warning: {
      icon: <AlertCircle className="text-accent" size={24} />,
      btnClass: 'bg-accent hover:bg-accent/90 text-accent-foreground',
      iconBg: 'bg-accent/10'
    },
    danger: {
      icon: <AlertCircle className="text-destructive" size={24} />,
      btnClass: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
      iconBg: 'bg-destructive/10'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md shadow-2xl border-none animate-in zoom-in-95 duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className={cn("p-3 rounded-2xl", config.iconBg)}>
              {config.icon}
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
            >
                <X size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed italic">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-12 font-bold" 
                onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button 
                className={cn("flex-1 rounded-xl h-12 font-bold shadow-lg", config.btnClass)}
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmModal;
