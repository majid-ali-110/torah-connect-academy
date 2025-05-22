
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Video, FileText, MessageSquare, Users, BookOpen, Loader2 } from 'lucide-react';

// Mock data for a session
const mockSession = {
  id: "123",
  title: "Introduction to Torah Study",
  teacherName: "Rabbi David",
  teacherImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
  subject: "Torah",
  date: "2023-06-15",
  startTime: "10:00 AM",
  endTime: "11:30 AM",
  description: "In this introductory session, we'll explore the fundamentals of Torah study and discuss approaches to understanding sacred texts."
};

const Classroom = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('video');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6">{mockSession.title}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-0 relative">
                  {/* Video Container with Aspect Ratio */}
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    {loading ? (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-t-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-10 w-10 text-torah-500 animate-spin mb-2" />
                          <p className="text-torah-700">Loading classroom...</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.iframe
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full rounded-t-lg"
                        src="https://meet.jit.si/TorahAcademyClassroom123"
                        allow="camera; microphone; fullscreen; display-capture"
                        style={{ border: 0 }}
                        title="Virtual Classroom"
                      ></motion.iframe>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="p-4 bg-white border-t flex flex-wrap gap-2">
                    <Button
                      variant={activeTab === 'video' ? 'default' : 'outline'}
                      className={activeTab === 'video' ? 'bg-torah-500' : ''}
                      onClick={() => setActiveTab('video')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button
                      variant={activeTab === 'chat' ? 'default' : 'outline'}
                      className={activeTab === 'chat' ? 'bg-torah-500' : ''}
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      variant={activeTab === 'participants' ? 'default' : 'outline'}
                      className={activeTab === 'participants' ? 'bg-torah-500' : ''}
                      onClick={() => setActiveTab('participants')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Participants
                    </Button>
                    <Button
                      variant={activeTab === 'materials' ? 'default' : 'outline'}
                      className={activeTab === 'materials' ? 'bg-torah-500' : ''}
                      onClick={() => setActiveTab('materials')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Content based on active tab */}
              <Card>
                <CardContent className="p-6">
                  {activeTab === 'video' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Video Controls</h2>
                      <p className="text-gray-600 mb-4">Use the video conference tools to interact with your teacher and fellow students.</p>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline">Toggle Camera</Button>
                        <Button variant="outline">Toggle Microphone</Button>
                        <Button variant="outline">Share Screen</Button>
                        <Button variant="outline">Raise Hand</Button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'chat' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Class Chat</h2>
                      <div className="h-64 border rounded p-4 mb-4 overflow-y-auto">
                        <p className="text-gray-500 italic text-center">Chat messages will appear here</p>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type your message..." 
                          className="flex-grow border rounded p-2" 
                        />
                        <Button>Send</Button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'participants' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Participants</h2>
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-torah-50 rounded">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={mockSession.teacherImage} alt={mockSession.teacherName} />
                            <AvatarFallback>{mockSession.teacherName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mockSession.teacherName}</p>
                            <Badge>Teacher</Badge>
                          </div>
                        </div>
                        <div className="flex items-center p-2">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback>Y</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">You</p>
                            <Badge variant="outline">Student</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'materials' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Class Materials</h2>
                      <div className="space-y-3">
                        <motion.a 
                          href="#" 
                          className="block p-3 border rounded flex items-center hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FileText className="h-5 w-5 mr-3 text-torah-600" />
                          <span>Introduction to Torah Study - Slides.pdf</span>
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block p-3 border rounded flex items-center hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BookOpen className="h-5 w-5 mr-3 text-torah-600" />
                          <span>Recommended Readings.pdf</span>
                        </motion.a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Session Details</h2>
                  
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={mockSession.teacherImage} alt={mockSession.teacherName} />
                      <AvatarFallback>{mockSession.teacherName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mockSession.teacherName}</p>
                      <p className="text-sm text-gray-500">Teacher</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{mockSession.subject}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{mockSession.date}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{mockSession.startTime} - {mockSession.endTime}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm">{mockSession.description}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Report an Issue
                    </Button>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-700">
                      Leave Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Classroom;
