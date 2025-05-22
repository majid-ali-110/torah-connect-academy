import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Navbar = () => {
  return <nav className="py-4 px-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/291e12e3-a310-4b8f-a7ac-621d484f544d.png" alt="E-team Torah Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold ml-2">TorahAcademy</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center justify-center flex-1 px-10">
          <h1 className="text-3xl font-semibold text-center">"As-tu fixé des E-teams à la Torah ?"</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="bg-black text-white hover:bg-gray-800 rounded-full">
            <Link to="/inscription">Inscription</Link>
          </Button>
          <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full">
            <Link to="/connexion">Connexion</Link>
          </Button>
        </div>
      </div>
    </nav>;
};
export default Navbar;