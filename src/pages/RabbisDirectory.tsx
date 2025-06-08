
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RabbisDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rabbis, setRabbis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRabbis = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rabbis').select('*');
      if (error) {
        console.error('Erreur lors de la récupération des rabbins:', error);
      } else {
        setRabbis(data || []);
      }
      setLoading(false);
    };

    fetchRabbis();
  }, []);

  const filteredRabbis = rabbis.filter(rabbi =>
    rabbi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rabbi.specialties?.some(specialty =>
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    rabbi.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Annuaire des Rabbins
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connectez-vous avec des rabbins qualifiés et des guides spirituels de votre communauté
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des rabbins par nom, spécialité ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Chargement des rabbins...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRabbis.map((rabbi) => (
                <Card key={rabbi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <img
                      src={rabbi.image_url || '/placeholder.svg'}
                      alt={rabbi.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <CardTitle className="text-xl">{rabbi.name}</CardTitle>
                    <p className="text-gray-600">{rabbi.title}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rabbi.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {rabbi.location}
                        </div>
                      )}
                      {rabbi.experience_years && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          {rabbi.experience_years} années d'expérience
                        </div>
                      )}
                      {rabbi.specialties && rabbi.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rabbi.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                      {rabbi.bio && (
                        <p className="text-sm text-gray-600">{rabbi.bio}</p>
                      )}
                      <Button className="w-full">Contacter le Rabbin</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default RabbisDirectory;
