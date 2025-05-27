
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  subjects: string[];
  languages: string[];
  availability_status: 'available' | 'busy' | 'offline';
  avatar_url?: string;
  role: 'teacher' | 'student';
}

const FindPartner = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAvailablePartners();
    
    // Set up realtime subscription for availability status
    const channel = supabase
      .channel('partner-availability')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          setPartners(prev => prev.map(partner => 
            partner.id === payload.new.id 
              ? { ...partner, availability_status: payload.new.availability_status }
              : partner
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAvailablePartners = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '')
        .in('availability_status', ['available', 'busy']);

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner =>
    `${partner.first_name} ${partner.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    partner.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConnect = async (partner: Partner) => {
    // Here you would implement the connection logic
    // For now, we'll just show an alert
    alert(`Connecting with ${partner.first_name} ${partner.last_name}...`);
    setSelectedPartner(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
              Find Your Study Partner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with fellow learners and teachers for collaborative Torah study
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <Input
              placeholder="Search by name, subject, or interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                  >
                    <Card className="h-full cursor-pointer overflow-hidden border-2 hover:border-teal-300 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={partner.avatar_url} alt={`${partner.first_name} ${partner.last_name}`} />
                              <AvatarFallback>
                                {partner.first_name?.[0]}{partner.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <motion.div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                partner.availability_status === 'available' ? 'bg-green-500' :
                                partner.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              animate={partner.availability_status === 'available' ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{partner.first_name} {partner.last_name}</h3>
                            <Badge variant={partner.role === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                              {partner.role === 'teacher' ? 'Teacher' : 'Student'}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{partner.bio}</p>
                        
                        {partner.subjects && partner.subjects.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-2">Interested in:</p>
                            <div className="flex flex-wrap gap-1">
                              {partner.subjects.slice(0, 3).map(subject => (
                                <Badge key={subject} variant="outline" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                              {partner.subjects.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{partner.subjects.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                className={`w-full transition-all duration-300 ${
                                  partner.availability_status === 'available' 
                                    ? 'bg-teal-500 hover:bg-teal-600' 
                                    : 'bg-gray-400 hover:bg-gray-500'
                                }`}
                                disabled={partner.availability_status === 'offline'}
                                onClick={() => setSelectedPartner(partner)}
                              >
                                {partner.availability_status === 'available' ? 'Connect Now' :
                                 partner.availability_status === 'busy' ? 'Request Connection' : 'Unavailable'}
                              </Button>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <DialogHeader>
                                <DialogTitle>Connect with {selectedPartner?.first_name}</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="mb-4">
                                  Would you like to connect with {selectedPartner?.first_name} {selectedPartner?.last_name} for Torah study?
                                </p>
                                <div className="flex space-x-4">
                                  <Button 
                                    onClick={() => selectedPartner && handleConnect(selectedPartner)}
                                    className="bg-teal-500 hover:bg-teal-600"
                                  >
                                    Yes, Connect
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setSelectedPartner(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {filteredPartners.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4">No partners found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'No study partners are currently available.'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default FindPartner;
