
import React from 'react';

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10">Foire aux Questions</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Pour qui s'adresse ce site?</h3>
          <p className="text-gray-700">
            Pour toutes personnes désirant fixer un moment d'étude dans sa journée: que ça soit homme, femme ou même enfants (aide à l'école ou préparation a la bar mitsva)
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Quels types de cours sont proposés ?</h3>
          <p className="text-gray-700">
            Des cours interactif en direct avec un Rav sur la matière désirée
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
