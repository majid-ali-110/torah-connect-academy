
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NewChatModal from './NewChatModal';

interface Conversation {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

interface ConversationsListProps {
  currentUserId: string;
  userRole: 'student' | 'teacher';
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  currentUserId,
  userRole,
  onSelectConversation,
  selectedConversation
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('messages-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const fetchConversations = async () => {
    try {
      // Get all users who have exchanged messages with current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          recipient_id,
          content,
          created_at,
          read_at,
          profiles!messages_sender_id_fkey(id, first_name, last_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      messagesData?.forEach((message) => {
        const otherUserId = message.sender_id === currentUserId 
          ? message.recipient_id 
          : message.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          // Get user info for the conversation partner
          const userProfile = message.sender_id === currentUserId 
            ? null 
            : (message as any).profiles;
          
          if (userProfile) {
            conversationMap.set(otherUserId, {
              id: otherUserId,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              avatar_url: userProfile.avatar_url,
              role: userProfile.role,
              last_message: {
                content: message.content,
                created_at: message.created_at,
                sender_id: message.sender_id
              },
              unread_count: 0
            });
          }
        }
      });

      // Get unread counts for each conversation
      const conversationsWithCounts = await Promise.all(
        Array.from(conversationMap.values()).map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', conv.id)
            .eq('recipient_id', currentUserId)
            .is('read_at', null);

          return {
            ...conv,
            unread_count: count || 0
          };
        })
      );

      setConversations(conversationsWithCounts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.first_name} ${conv.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button
            size="sm"
            onClick={() => setShowNewChatModal(true)}
            className="bg-torah-500 hover:bg-torah-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500"
            >
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new conversation to get started</p>
            </motion.div>
          ) : (
            filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-torah-50 border-torah-200' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar_url} />
                      <AvatarFallback className="bg-torah-100 text-torah-700">
                        {conversation.first_name?.[0]}{conversation.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.first_name} {conversation.last_name}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.last_message && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message.sender_id === currentUserId ? 'You: ' : ''}
                        {conversation.last_message.content}
                      </p>
                    )}
                    
                    <span className="text-xs text-torah-600 capitalize">
                      {conversation.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        currentUserId={currentUserId}
        userRole={userRole}
        onConversationCreated={(conversationId) => {
          setShowNewChatModal(false);
          onSelectConversation(conversationId);
          fetchConversations();
        }}
      />
    </div>
  );
};

export default ConversationsList;
