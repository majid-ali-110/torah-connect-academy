
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Shield, Video, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const {
    t
  } = useLanguage();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/find-teachers", label: "Find Teachers" },
    { to: "/find-partner", label: "Study Partners" },
    { to: "/live-courses", label: "Live Courses", icon: Video },
    { to: "/chat", label: "Messages" },
    ...(user ? [{ to: "/dashboard", label: t('nav.dashboard') }] : [])
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }} 
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="text-xl md:text-2xl font-bold text-torah-600"
            >
              TorahLearn
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-gray-700 hover:text-torah-600 transition-colors flex items-center text-sm xl:text-base"
              >
                {link.icon && <link.icon className="mr-1 h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Language selector and Auth */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.email} />
                      <AvatarFallback className="text-xs">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{profile?.first_name} {profile?.last_name}</span>
                  </DropdownMenuItem>
                  {profile?.role && (
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      <span className="capitalize">{profile.role}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">{t('nav.signup')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                {navigationLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="text-gray-700 hover:text-torah-600 transition-colors flex items-center py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
                
                <div className="sm:hidden pt-4 border-t border-gray-200">
                  <LanguageSelector />
                </div>
                
                {!user && (
                  <div className="sm:hidden flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav.login')}
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav.signup')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
