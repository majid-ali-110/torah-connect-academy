
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  sender?: { first_name: string; last_name: string; role: string };
}

interface Conversation {
  id: string;
  other_user: { first_name: string; last_name: string; role: string; id: string };
  last_message?: Message;
  unread_count: number;
}

const MessageSystem = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      // Get all messages involving the current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, first_name, last_name, role),
          recipient:profiles!recipient_id(id, first_name, last_name, role)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      messagesData?.forEach((message) => {
        const isFromCurrentUser = message.sender_id === user.id;
        const otherUser = isFromCurrentUser ? message.recipient : message.sender;
        const partnerId = otherUser.id;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            other_user: otherUser,
            last_message: message,
            unread_count: 0
          });
        }

        // Count unread messages from this partner
        if (!isFromCurrentUser && !message.is_read) {
          const conv = conversationMap.get(partnerId);
          if (conv) conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(first_name, last_name, role)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user, fetchConversations]);

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          recipient_id: selectedConversation,
          is_read: false
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        fetchConversations();
        if (selectedConversation === payload.new.sender_id) {
          fetchMessages(selectedConversation);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation, fetchConversations, fetchMessages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 p-4">No conversations yet</p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-8 h-8 p-1 bg-gray-200 rounded-full mr-3" />
                      <div>
                        <p className="font-medium">
                          {conversation.other_user.first_name} {conversation.other_user.last_name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {conversation.other_user.role}
                        </p>
                        {conversation.last_message && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                    {conversation.unread_count > 0 && (
                      <Badge variant="destructive" className="rounded-full">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedConversation ? (
              (() => {
                const conv = conversations.find(c => c.id === selectedConversation);
                return conv ? `${conv.other_user.first_name} ${conv.other_user.last_name}` : 'Messages';
              })()
            ) : (
              'Select a conversation'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {selectedConversation ? (
            <>
              <ScrollArea className="h-[400px] p-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500">Start a conversation...</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-torah-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleDateString()} {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSystem;
