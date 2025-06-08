
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, Calendar, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Users,
    title: 'Trouver un Professeur',
    description: 'Connectez-vous avec des rabbins et enseignants qualifiés',
    link: '/find-teachers',
    color: 'bg-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Cours en Direct',
    description: 'Participez à des sessions d\'apprentissage en direct',
    link: '/live-courses',
    color: 'bg-green-500'
  },
  {
    icon: Calendar,
    title: 'Cours pour Enfants',
    description: 'Programmes spécialement conçus pour les jeunes apprenants',
    link: '/children-courses',
    color: 'bg-purple-500'
  },
  {
    icon: Video,
    title: 'Partenaire d\'Étude',
    description: 'Trouvez des partenaires pour étudier ensemble',
    link: '/find-partner',
    color: 'bg-orange-500'
  }
];

const FeatureBlocks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez l'expérience d'apprentissage parfaite adaptée à vos besoins et préférences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={feature.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-torah-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBlocks;
