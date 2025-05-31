
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'student' | 'teacher';
  subjects?: string[];
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  userRole: 'student' | 'teacher';
  onConversationCreated: (conversationId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  userRole,
  onConversationCreated
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, userRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Students can only chat with teachers, teachers can chat with students
      const targetRole = userRole === 'student' ? 'teacher' : 'student';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role, subjects')
        .eq('role', targetRole)
        .neq('id', currentUserId);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (otherUserId: string) => {
    setCreating(true);
    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(student_id.eq.${userRole === 'student' ? currentUserId : otherUserId},teacher_id.eq.${userRole === 'teacher' ? currentUserId : otherUserId})`
        )
        .single();

      if (existingConv) {
        onConversationCreated(existingConv.id);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert([{
          student_id: userRole === 'student' ? currentUserId : otherUserId,
          teacher_id: userRole === 'teacher' ? currentUserId : otherUserId
        }])
        .select()
        .single();

      if (error) throw error;
      onConversationCreated(newConv.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${userRole === 'student' ? 'teachers' : 'students'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-torah-500"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No {userRole === 'student' ? 'teachers' : 'students'} found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
                  onClick={() => createConversation(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-torah-100 text-torah-700">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </h4>
                      <p className="text-sm text-torah-600 capitalize">{user.role}</p>
                      {user.subjects && user.subjects.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {user.subjects.slice(0, 2).join(', ')}
                          {user.subjects.length > 2 && ` +${user.subjects.length - 2}`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={creating}
                    className="bg-torah-50 hover:bg-torah-100 border-torah-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatModal;
