
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Session {
  id: string;
  title: string;
  description: string;
  teacher_name: string;
  session_date: string;
  start_time: string;
  duration_minutes: number;
  max_participants: number;
  current_participants: number;
  meeting_url: string;
  subject: string;
  level: string;
  is_active: boolean;
}

const OnlineBeitMidrash = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('beit_midrash_sessions')
        .select('*')
        .eq('is_active', true)
        .gte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Beit Midrash sessions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (meetingUrl: string) => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
    } else {
      toast({
        title: 'Session Not Available',
        description: 'The meeting link is not yet available for this session.',
        variant: 'destructive',
      });
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || session.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-amber-900">Online Beit Midrash</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our virtual study hall for collaborative Torah learning. Connect with scholars and students from around the world.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions by title, teacher, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sessions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge variant={session.level === 'beginner' ? 'default' : session.level === 'intermediate' ? 'secondary' : 'destructive'}>
                        {session.level}
                      </Badge>
                    </div>
                    <p className="text-amber-700 font-medium">Teacher: {session.teacher_name}</p>
                    {session.subject && (
                      <Badge variant="outline">{session.subject}</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{session.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(session.session_date), 'EEEE, MMMM do, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {session.start_time} ({session.duration_minutes} minutes)
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {session.current_participants}/{session.max_participants} participants
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => joinSession(session.meeting_url)}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={session.current_participants >= session.max_participants}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {session.current_participants >= session.max_participants ? 'Session Full' : 'Join Session'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredSessions.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Sessions Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineBeitMidrash;
