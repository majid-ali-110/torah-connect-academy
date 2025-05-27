
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SOSPartner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Besoin d'aide urgente ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez immédiatement un partenaire d'étude ou un tuteur disponible pour vous aider
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>SOS Partenaire</CardTitle>
                <CardDescription>
                  Connectez-vous instantanément avec un autre étudiant pour étudier ensemble
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    Disponible 24h/24
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                    Chat instantané
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    Partenaires vérifiés
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/sos-partner">
                    Trouver un partenaire
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>SOS Havruta</CardTitle>
                <CardDescription>
                  Trouvez un partenaire d'étude traditionnel pour l'apprentissage en binôme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    Sessions programmées
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                    Méthode traditionnelle
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    Apprentissage collaboratif
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/sos-havrouta">
                    Trouver une Havruta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SOSPartner;
