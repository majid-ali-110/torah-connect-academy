
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { sanitizeHtml } from '@/utils/inputSanitization';
import { validateTextLength } from '@/utils/inputValidation';
import { toast } from 'sonner';

interface SecureMessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

const SecureMessageInput: React.FC<SecureMessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...'
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageTime = useRef<number>(0);

  const MAX_MESSAGE_LENGTH = 2000;
  const MIN_MESSAGE_INTERVAL = 1000; // 1 second between messages

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Sanitize input to prevent XSS
    value = sanitizeHtml(value);
    
    // Enforce length limit
    if (value.length > MAX_MESSAGE_LENGTH) {
      value = value.substring(0, MAX_MESSAGE_LENGTH);
      toast.error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
    }
    
    setMessage(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    
    // Validate message content
    if (!validateTextLength(trimmedMessage, MAX_MESSAGE_LENGTH)) {
      toast.error('Please enter a valid message (1-2000 characters)');
      return;
    }
    
    // Rate limiting - prevent spam
    const now = Date.now();
    if (now - lastMessageTime.current < MIN_MESSAGE_INTERVAL) {
      toast.error('Please wait a moment before sending another message');
      return;
    }
    
    // Additional security checks
    if (trimmedMessage.includes('<script') || 
        trimmedMessage.includes('javascript:') || 
        trimmedMessage.includes('onclick=')) {
      toast.error('Message contains potentially dangerous content');
      return;
    }
    
    setIsLoading(true);
    lastMessageTime.current = now;
    
    try {
      await onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onInput={adjustTextareaHeight}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
          <span className="text-xs text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={disabled || isLoading || !message.trim()}
        size="sm"
        className="px-3"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default SecureMessageInput;
