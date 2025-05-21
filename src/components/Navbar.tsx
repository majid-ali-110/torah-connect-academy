
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Link to="/" className="font-bold text-2xl text-torah-600">TorahConnect</Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <Link to="/find-teachers" className="text-gray-700 hover:text-torah-600 transition-colors">
            Find teachers
          </Link>
          <Link to="/for-teachers" className="text-gray-700 hover:text-torah-600 transition-colors">
            For teachers
          </Link>
          <Link to="/for-organizations" className="text-gray-700 hover:text-torah-600 transition-colors">
            For organizations
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </div>
          <Button asChild className="bg-torah-500 hover:bg-torah-600">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
