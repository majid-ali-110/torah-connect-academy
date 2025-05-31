
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Calendar, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MeetingScheduler from './MeetingScheduler';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
  sender: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  userRole: 'student' | 'teacher';
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  currentUserId,
  userRole
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      fetchOtherUser();
      markMessagesAsRead();

      // Subscribe to real-time messages
      const channel = supabase
        .channel(`chat-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${currentUserId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // Get messages where current user is sender or recipient
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          read_at,
          profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        ...msg,
        sender: (msg as any).profiles
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUser = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      setOtherUser(data);
    } catch (error) {
      console.error('Error fetching other user:', error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('recipient_id', currentUserId)
        .eq('sender_id', conversationId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          recipient_id: conversationId,
          content: newMessage.trim()
        }]);

      if (error) throw error;
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      {otherUser && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.avatar_url} />
                <AvatarFallback className="bg-torah-100 text-torah-700">
                  {otherUser.first_name?.[0]}{otherUser.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {otherUser.first_name} {otherUser.last_name}
                </h3>
                <span className="text-sm text-torah-600 capitalize">
                  {otherUser.role}
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMeetingScheduler(true)}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Meeting</span>
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                  {formatDate(dayMessages[0].created_at)}
                </div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isOwn = message.sender_id === currentUserId;
                const showAvatar = !isOwn && (index === 0 || dayMessages[index - 1].sender_id !== message.sender_id);

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {showAvatar && !isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.sender.avatar_url} />
                          <AvatarFallback className="bg-torah-100 text-torah-700 text-xs">
                            {message.sender.first_name?.[0]}{message.sender.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`${!showAvatar && !isOwn ? 'ml-10' : ''}`}>
                        <div className={`px-4 py-2 rounded-lg ${
                          isOwn 
                            ? 'bg-torah-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        <div className={`flex items-center space-x-1 mt-1 ${
                          isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwn && (
                            <div className="text-xs text-gray-500">
                              {message.read_at ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none min-h-[40px] max-h-32"
              rows={1}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="bg-torah-500 hover:bg-torah-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      {showMeetingScheduler && (
        <MeetingScheduler
          isOpen={showMeetingScheduler}
          onClose={() => setShowMeetingScheduler(false)}
          conversationId={conversationId}
          currentUserId={currentUserId}
          otherUser={otherUser}
        />
      )}
    </div>
  );
};

export default ChatWindow;
