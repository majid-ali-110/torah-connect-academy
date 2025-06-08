
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-torah-50 to-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f9ff" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Trouvez Votre Partenaire d'Étude Torah Parfait
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
          >
            Connectez-vous avec des enseignants Torah expérimentés pour des expériences d'apprentissage personnalisées
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/find-teachers">
              <Button size="lg" className="bg-torah-600 hover:bg-torah-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Trouver des Professeurs
              </Button>
            </Link>
            
            <Link to="/find-partner">
              <Button size="lg" variant="outline" className="border-torah-600 text-torah-600 hover:bg-torah-50 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Partenaires d'Étude
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Trouvez des Professeurs ou Partenaires d'Étude
            </h3>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par matière, nom de professeur, ou mots-clés..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-torah-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = '/find-teachers';
                  }
                }}
              />
            </div>
            
            <Button 
              className="w-full mt-6 bg-torah-600 hover:bg-torah-700 text-white py-3 text-lg font-semibold rounded-lg"
              onClick={() => window.location.href = '/find-teachers'}
            >
              Rechercher
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
