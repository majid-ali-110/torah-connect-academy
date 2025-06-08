import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const RabbisDirectory = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [rabbis, setRabbis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRabbis = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rabbis').select('*');
      if (error) {
        console.error('Error fetching rabbis:', error);
      } else {
        setRabbis(data);
      }
      setLoading(false);
    };

    fetchRabbis();
  }, []);

  const filteredRabbis = rabbis.filter(rabbi =>
    rabbi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rabbi.specialties.some(specialty =>
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    rabbi.location.toLowerCase().includes(searchTerm.toLowerCase())
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
              Rabbis Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with qualified rabbis and spiritual leaders in your community
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search rabbis by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading rabbis...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRabbis.map((rabbi) => (
                <Card key={rabbi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <img
                      src={rabbi.image || '/placeholder.svg'}
                      alt={rabbi.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <CardTitle className="text-xl">{rabbi.name}</CardTitle>
                    <p className="text-gray-600">{rabbi.title}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {rabbi.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        {rabbi.rating} ({rabbi.students} students)
                      </div>
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
                      <p className="text-sm text-gray-600">{rabbi.bio}</p>
                      <Button className="w-full">Contact Rabbi</Button>
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
