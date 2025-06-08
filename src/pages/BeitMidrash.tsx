
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Calendar, Play } from 'lucide-react';

const studySessions = [
  {
    id: '1',
    title: 'Daily Daf Yomi',
    description: 'Join our daily Talmud study session',
    participants: 34,
    startTime: '7:00 AM EST',
    duration: '1 hour',
    level: 'Intermediate',
    status: 'live'
  },
  {
    id: '2',
    title: 'Parsha Study Circle',
    description: 'Weekly Torah portion discussion',
    participants: 18,
    startTime: '8:00 PM EST',
    duration: '45 minutes',
    level: 'All Levels',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Mishnah Mastery',
    description: 'Systematic study of Mishnah',
    participants: 12,
    startTime: '2:00 PM EST',
    duration: '30 minutes',
    level: 'Beginner',
    status: 'upcoming'
  }
];

const resources = [
  {
    id: '1',
    title: 'Shas Digital Library',
    description: 'Complete Talmud with commentaries',
    type: 'Text Study'
  },
  {
    id: '2',
    title: 'Audio Shiurim Collection',
    description: 'Thousands of recorded lectures',
    type: 'Audio'
  },
  {
    id: '3',
    title: 'Halacha Database',
    description: 'Searchable Jewish law reference',
    type: 'Reference'
  }
];

const BeitMidrash = () => {
  const { t } = useLanguage();

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
              Online Beit Midrash
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our virtual study hall for collaborative Torah learning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Study Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studySessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{session.title}</h3>
                              <Badge variant={session.status === 'live' ? 'destructive' : 'secondary'}>
                                {session.status === 'live' ? 'LIVE' : 'Upcoming'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {session.participants} participants
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {session.startTime}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {session.duration}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2">
                              {session.level}
                            </Badge>
                            <br />
                            <Button size="sm" variant={session.status === 'live' ? 'default' : 'outline'}>
                              <Play className="h-4 w-4 mr-1" />
                              {session.status === 'live' ? 'Join Now' : 'Schedule'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Morning Kollel</span>
                      <span className="text-sm text-gray-500">6:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daf Yomi</span>
                      <span className="text-sm text-gray-500">7:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Halacha Shiur</span>
                      <span className="text-sm text-gray-500">12:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Evening Study</span>
                      <span className="text-sm text-gray-500">8:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">Start Private Study</Button>
                  <Button variant="outline" className="w-full">Find Study Partner</Button>
                  <Button variant="outline" className="w-full">Browse Resources</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default BeitMidrash;
