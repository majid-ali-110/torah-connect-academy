
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, user } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  
  return (
    <nav className="py-4 px-4 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/291e12e3-a310-4b8f-a7ac-621d484f544d.png" alt="Torah Academy Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold ml-2">TorahAcademy</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="relative group">
            <button 
              className="flex items-center space-x-1 text-gray-700 hover:text-torah-600 transition-colors"
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <span>Courses</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <AnimatePresence>
              {submenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 z-50"
                  onMouseEnter={() => setSubmenuOpen(true)}
                  onMouseLeave={() => setSubmenuOpen(false)}
                >
                  <Link to="/children-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-torah-50 rounded-md">Children's Learning</Link>
                  <Link to="/women-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-torah-50 rounded-md">Women's Studies</Link>
                  <Link to="/live-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-torah-50 rounded-md">Live Courses</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link to="/sos-partner" className="text-gray-700 hover:text-torah-600 transition-colors">Find a Partner</Link>
          <Link to="/search" className="text-gray-700 hover:text-torah-600 transition-colors">Teachers</Link>
          <Link to="/about" className="text-gray-700 hover:text-torah-600 transition-colors">About Us</Link>
        </div>
        
        {/* Auth Section */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-torah-600 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name} />
                  <AvatarFallback>
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">
                  {profile?.first_name} {profile?.last_name}
                </span>
              </div>
              <Button variant="outline" onClick={signOut} className="rounded-full border-torah-500 text-torah-600 hover:bg-torah-50">
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" asChild className="rounded-full border-torah-500 text-torah-600 hover:bg-torah-50">
                <Link to="/inscription">Sign Up</Link>
              </Button>
              <Button asChild className="bg-torah-500 text-white hover:bg-torah-600 rounded-full">
                <Link to="/connexion">Log In</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <div className="container mx-auto px-4 pt-4 pb-6 space-y-4">
              <div className="flex flex-col space-y-2">
                <Link to="/children-courses" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Children's Learning</Link>
                <Link to="/women-courses" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Women's Studies</Link>
                <Link to="/live-courses" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Live Courses</Link>
                <Link to="/sos-partner" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Find a Partner</Link>
                <Link to="/search" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Teachers</Link>
                <Link to="/about" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">About Us</Link>
                {user && (
                  <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:bg-torah-50 rounded-md">Dashboard</Link>
                )}
              </div>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                {user ? (
                  <Button variant="outline" onClick={signOut} className="w-full justify-center">
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full justify-center">
                      <Link to="/inscription">Sign Up</Link>
                    </Button>
                    <Button asChild className="w-full justify-center bg-torah-500 hover:bg-torah-600">
                      <Link to="/connexion">Log In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
