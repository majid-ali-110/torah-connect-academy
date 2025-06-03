
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const {
    t
  } = useLanguage();
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
            
            <Link to="/find-partner" className="text-gray-700 hover:text-torah-600 transition-colors">
              Study Partners
            </Link>

            {user && (
              <Link to="/chat" className="text-gray-700 hover:text-torah-600 transition-colors">
                Messages
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{profile?.first_name} {profile?.last_name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
    </motion.nav>
  );
};

export default Navbar;
