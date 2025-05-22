
import React from 'react';

const Testimonials = () => {
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-10 text-center">Témoignages des utilisateurs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            « J'ai toujours eu mal à trouver le temps d'étudier la Torah, mais grâce à cette plateforme, j'ai pu consacrer 20 minutes par jour à l'étude. Je peux désormais planifier mes sessions d'étude avec un Rav à ma convenance, et je suis très satisfait de la façon dont cela m'a aidé à équilibrer ma vie et ma croissance spirituelle. »
          </p>
          <p className="font-semibold">David F.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            « En tant que parent, j'ai constaté une réelle amélioration dans l'apprentissage de la Torah de mon enfant grâce à l'aide des Rabbins disponibles sur la plateforme. Mon enfant a désormais accès à des leçons personnalisées et à des conseils, ce qui a fait toute la différence dans ses études. »
          </p>
          <p className="font-semibold">Michael S.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            « Étant étudiant en Espagne, sans communauté, j'avais du mal avec mon apprentissage de la Torah. Cependant, cette plateforme m'a permis de me connecter avec un Rav et de planifier des sessions d'étude régulières. Non seulement j'ai progressé dans mes études, mais j'ai également formé une amitié avec mon Rav, qui m'a donné de précieux conseils pour réussir dans la vie. »
          </p>
          <p className="font-semibold">Jonathan C.</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
