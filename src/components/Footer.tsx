
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">E-team.torah</h3>
            <p className="text-gray-600 mb-4">
              Plateforme de connexion entre étudiants et enseignants de Torah pour des cours interactifs en ligne.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/rabbanim" className="text-gray-600 hover:text-torah-600">Annuaire des Rabbanim</Link></li>
              <li><Link to="/eleves" className="text-gray-600 hover:text-torah-600">Section pour élèves/enfants</Link></li>
              <li><Link to="/femmes" className="text-gray-600 hover:text-torah-600">Section pour femmes</Link></li>
              <li><Link to="/beit-hamidrash" className="text-gray-600 hover:text-torah-600">Beit Hamidrash en ligne</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-torah-600">FAQ</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-torah-600">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-torah-600">Contact</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-torah-600">Support technique</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions" className="text-gray-600 hover:text-torah-600">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-torah-600">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-torah-600">Politique de cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} E-team.torah. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
