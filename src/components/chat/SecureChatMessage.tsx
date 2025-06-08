
import React from 'react';
import { sanitizeHtml } from '@/utils/inputSanitization';

interface SecureChatMessageProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
  senderName?: string;
}

const SecureChatMessage: React.FC<SecureChatMessageProps> = ({
  content,
  isOwn,
  timestamp,
  senderName
}) => {
  // Sanitize message content to prevent XSS
  const sanitizedContent = sanitizeHtml(content);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {!isOwn && senderName && (
          <div className="text-xs font-semibold mb-1 opacity-70">
            {senderName}
          </div>
        )}
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <div className="text-xs opacity-70 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SecureChatMessage;
