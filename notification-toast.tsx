import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";

interface NotificationToastProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
}

export default function NotificationToast({
  title,
  message,
  type = 'success',
  visible,
  onClose
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const getTypeColor = () => {
    switch (type) {
      case 'success': return 'gaming-emerald';
      case 'error': return 'status-offline';
      case 'info': return 'gaming-cyan';
      default: return 'gaming-emerald';
    }
  };

  if (!visible && !isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-transform duration-300 ${
      isVisible ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <Card className="gaming-card border-[hsl(var(--gaming-border))] shadow-2xl min-w-[300px]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 bg-[hsl(var(--${getTypeColor()}))] rounded-full`}></div>
            <div className="flex-1">
              <p className="text-white font-medium">{title}</p>
              <p className="text-gray-400 text-sm">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <FaTimes />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
