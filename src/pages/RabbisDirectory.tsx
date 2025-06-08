
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Rabbi {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  contact_email: string;
  phone: string;
  image_url: string;
  languages: string[];
  experience_years: number;
}

const RabbisDirectory = () => {
  const [rabbis, setRabbis] = useState<Rabbi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRabbis();
  }, []);

  const fetchRabbis = async () => {
    try {
      const { data, error } = await supabase
        .from('rabbis')
        .select('*')
        .order('name');

      if (error) throw error;
      setRabbis(data || []);
    } catch (error) {
      console.error('Error fetching rabbis:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rabbis directory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRabbis = rabbis.filter(rabbi => {
    const matchesSearch = rabbi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rabbi.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || rabbi.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const allSpecialties = [...new Set(rabbis.flatMap(r => r.specialties))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Rabbis Directory</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with our experienced rabbis and Torah scholars for guidance, learning, and spiritual growth.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-64">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {allSpecialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading rabbis directory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRabbis.map((rabbi, index) => (
              <motion.div
                key={rabbi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-center">
                      {rabbi.image_url && (
                        <img
                          src={rabbi.image_url}
                          alt={rabbi.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                        />
                      )}
                      <CardTitle className="text-xl">{rabbi.name}</CardTitle>
                      <p className="text-torah-600 font-medium">{rabbi.title}</p>
                      <p className="text-sm text-gray-500">{rabbi.experience_years} years experience</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{rabbi.bio}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {rabbi.specialties.map(specialty => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Languages:</h4>
                      <div className="flex flex-wrap gap-1">
                        {rabbi.languages.map(language => (
                          <Badge key={language} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      {rabbi.contact_email && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          {rabbi.contact_email}
                        </Button>
                      )}
                      {rabbi.phone && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          {rabbi.phone}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RabbisDirectory;
