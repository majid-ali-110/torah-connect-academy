
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Settings, MessageCircle, Users, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingPartnerRequests, setPendingPartnerRequests] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      
      // Set up real-time subscriptions for messages and partner requests
      const messagesChannel = supabase
        .channel('messages')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'chat_messages', filter: `conversation_id=in.(select id from conversations where student_id=eq.${user.id} or teacher_id=eq.${user.id})` },
          () => fetchUnreadCounts()
        )
        .subscribe();

      const partnerChannel = supabase
        .channel('partner_requests')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'study_partner_matches', filter: `partner_id=eq.${user.id}` },
          () => fetchUnreadCounts()
        )
        .subscribe();

      return () => {
        messagesChannel.unsubscribe();
        partnerChannel.unsubscribe();
      };
    }
  }, [user]);

  const fetchUnreadCounts = async () => {
    if (!user) return;

    try {
      // Count unread messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`);

      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        const { count: messageCount } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .in('conversation_id', conversationIds)
          .neq('sender_id', user.id)
          .is('read_at', null);

        setUnreadMessages(messageCount || 0);
      }

      // Count pending partner requests
      const { count: partnerCount } = await supabase
        .from('study_partner_matches')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', user.id)
        .eq('status', 'pending');

      setPendingPartnerRequests(partnerCount || 0);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }} 
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="text-2xl font-bold text-torah-600"
            >
              TorahLearn
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-torah-600 transition-colors">
              {t('nav.home')}
            </Link>
            
            <Link to="/search" className="text-gray-700 hover:text-torah-600 transition-colors">
              {t('nav.teachers')}
            </Link>
            
            <Link to="/find-partner" className="text-gray-700 hover:text-torah-600 transition-colors relative">
              Study Partners
              {pendingPartnerRequests > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center p-0">
                  {pendingPartnerRequests}
                </Badge>
              )}
            </Link>

            {user && (
              <Link to="/chat" className="text-gray-700 hover:text-torah-600 transition-colors relative">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                  {unreadMessages > 0 && (
                    <Badge className="bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center p-0">
                      {unreadMessages}
                    </Badge>
                  )}
                </div>
              </Link>
            )}
            
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-torah-600 transition-colors">
                {t('nav.dashboard')}
              </Link>
            )}
          </div>

          {/* Right side - Language selector and Auth */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.email} />
                      <AvatarFallback>
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {(unreadMessages > 0 || pendingPartnerRequests > 0) && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{profile?.first_name} {profile?.last_name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="cursor-pointer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                      {unreadMessages > 0 && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs">
                          {unreadMessages}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/find-partner" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Study Partners</span>
                      {pendingPartnerRequests > 0 && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs">
                          {pendingPartnerRequests}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">{t('nav.signup')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
