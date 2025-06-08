
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SOSPartner = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-torah-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez Votre Partenaire d'Étude
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connectez-vous avec d'autres étudiants pour un apprentissage collaboratif et un soutien mutuel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Groupes d'Étude</h3>
                  <p className="text-gray-600">Rejoignez des groupes d'étude avec des étudiants de votre niveau</p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                    <li>Sessions d'apprentissage collaboratif</li>
                    <li>Enseignement entre pairs</li>
                    <li>Horaires d'étude partagés</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Forums de Discussion</h3>
                  <p className="text-gray-600">Participez à des discussions enrichissantes sur vos études</p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                    <li>Posez des questions et obtenez des réponses</li>
                    <li>Partagez vos idées et découvertes</li>
                    <li>Construisez des amitiés durables</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Planification Flexible</h3>
                  <p className="text-gray-600">Trouvez des partenaires qui correspondent à votre disponibilité</p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                    <li>Coordonnez les horaires d'étude</li>
                    <li>Sessions de groupe hebdomadaires</li>
                    <li>Aide d'étude d'urgence</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-torah-400 to-torah-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Prêt à Commencer ?
              </h3>
              <p className="text-gray-600 mb-8">
                Rejoignez notre communauté d'apprentissage et trouvez votre partenaire d'étude idéal dès aujourd'hui.
              </p>
              <Link to="/find-partner">
                <Button size="lg" className="bg-torah-600 hover:bg-torah-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Trouver des Partenaires d'Étude
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SOSPartner;
