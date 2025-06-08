
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Plus, Video, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  student_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
  other_user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  meeting_data?: any;
  read_at?: string;
  created_at: string;
}

const Chat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('chat_messages')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'chat_messages' },
          (payload) => {
            const newMessage = payload.new as Message;
            if (newMessage.conversation_id === selectedConversation) {
              setMessages(prev => [...prev, newMessage]);
              markMessageAsRead(newMessage.id);
            }
            fetchConversations(); // Update conversation list
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch additional data for each conversation
      const enrichedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.student_id === user.id ? conv.teacher_id : conv.student_id;
          
          // Get other user's profile
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, role')
            .eq('id', otherUserId)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .is('read_at', null);

          return {
            ...conv,
            other_user: otherUser,
            last_message: lastMessage,
            unread_count: unreadCount || 0
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      const unreadMessages = (data || []).filter(msg => 
        msg.sender_id !== user?.id && !msg.read_at
      );

      if (unreadMessages.length > 0) {
        await supabase
          .from('chat_messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadMessages.map(msg => msg.id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .neq('sender_id', user?.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation);

      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const startVideoCall = async () => {
    if (!selectedConversation || !user) return;

    try {
      const roomId = `meeting_${selectedConversation}_${Date.now()}`;
      const meetingData = {
        roomId,
        startedBy: user.id,
        startedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: 'Started a video call',
          message_type: 'video_call',
          meeting_data: meetingData
        });

      if (error) throw error;

      // Open video call in new window
      window.open(`/video-call/${roomId}`, '_blank');
    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Conversations List */}
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Conversations</span>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-full">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No conversations yet</p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedConversation === conv.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={conv.other_user?.avatar_url} />
                            <AvatarFallback>
                              {conv.other_user?.first_name?.[0]}{conv.other_user?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {conv.other_user?.first_name} {conv.other_user?.last_name}
                              </p>
                              {conv.unread_count && conv.unread_count > 0 && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  {conv.unread_count}
                                </Badge>
                              )}
                            </div>
                            {conv.last_message && (
                              <p className="text-xs text-gray-500 truncate">
                                {conv.last_message.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedConversation && selectedConv ? (
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={selectedConv.other_user?.avatar_url} />
                          <AvatarFallback>
                            {selectedConv.other_user?.first_name?.[0]}{selectedConv.other_user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {selectedConv.other_user?.first_name} {selectedConv.other_user?.last_name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {selectedConv.other_user?.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={startVideoCall}>
                          <Video className="h-4 w-4 mr-2" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-0 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Start your conversation</p>
                        </div>
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
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender_id === user?.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                {message.message_type === 'video_call' ? (
                                  <div className="flex items-center space-x-2">
                                    <Video className="h-4 w-4" />
                                    <span className="text-sm">{message.content}</span>
                                  </div>
                                ) : (
                                  <p className="text-sm">{message.content}</p>
                                )}
                                <p className="text-xs opacity-75 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="p-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                          disabled={sending}
                        />
                        <Button 
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a conversation to start chatting</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Chat;
