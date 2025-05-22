
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';

// Mock teacher data (would come from API in a real app)
const mockTeachers = {
  "1": {
    id: 1,
    name: 'Rabbi David Cohen',
    title: 'Expert Torah Teacher',
    description: 'With over 20 years of teaching experience, Rabbi David provides deep insights into Torah studies with a focus on practical applications in modern life. His engaging teaching style makes complex topics accessible to learners of all levels.',
    subjects: ['Torah', 'Talmud', 'Hebrew'],
    audiences: ['Adults', 'Children'],
    languages: ['English', 'Hebrew'],
    hourlyRate: 40,
    rating: 4.9,
    reviewCount: 124,
    location: 'Jerusalem, Israel',
    experience: '20+ years',
    education: ['Yeshiva University', 'Hebrew University of Jerusalem'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60',
    availableSlots: [
      { day: 'Monday', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] },
    ],
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, comment: 'Rabbi David is an exceptional teacher! His lessons are engaging and he explains complex concepts in an easy-to-understand way.', date: '2023-04-15' },
      { id: 2, user: 'Michael K.', rating: 5, comment: 'I've learned so much in just a few sessions. Highly recommended!', date: '2023-03-22' },
      { id: 3, user: 'Rebecca L.', rating: 4, comment: 'Great teacher, very knowledgeable and patient. The lessons are well-structured.', date: '2023-02-10' },
    ]
  },
  "2": {
    id: 2,
    name: 'Sarah Goldstein',
    title: 'Torah and Jewish History Teacher',
    description: 'Sarah specializes in women's Torah studies and Jewish history. Her classes are known for their warm atmosphere and inclusive approach, making Torah learning accessible to women of all backgrounds.',
    subjects: ['Torah', 'Jewish History', 'Holidays'],
    audiences: ['Women', 'Children'],
    languages: ['English', 'French'],
    hourlyRate: 35,
    rating: 4.8,
    reviewCount: 89,
    location: 'New York, USA',
    experience: '15 years',
    education: ['Stern College', 'Jewish Theological Seminary'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60',
    availableSlots: [
      { day: 'Tuesday', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '12:00 PM'] },
    ],
    reviews: [
      { id: 1, user: 'Rachel G.', rating: 5, comment: 'Sarah is a wonderful teacher. Her knowledge of Jewish history is impressive and her teaching style is engaging.', date: '2023-05-10' },
      { id: 2, user: 'Leah F.', rating: 5, comment: 'I've been taking classes with Sarah for months and I've learned so much. She creates a supportive environment for women to learn.', date: '2023-04-05' },
      { id: 3, user: 'Hannah B.', rating: 4, comment: 'Great classes for women wanting to deepen their Torah knowledge.', date: '2023-03-18' },
    ]
  }
};

// Calendar Day Component
const CalendarDay = ({ day, slots, onSelectSlot, selectedSlot }: { 
  day: string; 
  slots: string[]; 
  onSelectSlot: (day: string, time: string) => void;
  selectedSlot: { day: string, time: string } | null;
}) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">{day}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {slots.map(time => {
          const isSelected = selectedSlot?.day === day && selectedSlot?.time === time;
          return (
            <motion.button
              key={time}
              className={`py-2 px-3 text-sm rounded-md border transition-all ${
                isSelected 
                  ? 'bg-torah-500 text-white border-torah-500' 
                  : 'bg-white hover:bg-torah-50 border-gray-200'
              }`}
              onClick={() => onSelectSlot(day, time)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Reviews Component
const Reviews = ({ reviews }: { reviews: any[] }) => {
  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{review.user}</span>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
            ))}
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

const TeacherProfile = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Get the teacher data based on ID
  const teacher = mockTeachers[teacherId as keyof typeof mockTeachers];
  
  if (!teacher) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Teacher not found</h2>
          <p>The teacher you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }
  
  const handleSelectSlot = (day: string, time: string) => {
    setSelectedSlot({ day, time });
  };
  
  const handleBookLesson = () => {
    if (selectedSlot) {
      alert(`Booking lesson with ${teacher.name} on ${selectedSlot.day} at ${selectedSlot.time}`);
      // In a real app, this would navigate to the booking confirmation page
    } else {
      alert('Please select a time slot first');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Teacher Info Column */}
          <div className="md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={teacher.image} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{teacher.name}</h1>
                    <p className="text-torah-600 mb-2">{teacher.title}</p>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{teacher.rating}</span>
                      <span className="text-gray-500 ml-1">({teacher.reviewCount} reviews)</span>
                    </div>
                    <p className="text-gray-600">${teacher.hourlyRate}/hour</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h2 className="font-semibold mb-2">Subjects</h2>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {teacher.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="bg-torah-100 text-torah-700">{subject}</Badge>
                      ))}
                    </div>
                    
                    <h2 className="font-semibold mb-2">Teaches</h2>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {teacher.audiences.map(audience => (
                        <Badge key={audience} variant="outline" className="text-gray-600">{audience}</Badge>
                      ))}
                    </div>
                    
                    <h2 className="font-semibold mb-2">Languages</h2>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {teacher.languages.map(language => (
                        <Badge key={language} variant="outline" className="text-blue-600 border-blue-200">{language}</Badge>
                      ))}
                    </div>
                    
                    <h2 className="font-semibold mb-2">Location</h2>
                    <p className="text-gray-700 mb-4">{teacher.location}</p>
                    
                    <h2 className="font-semibold mb-2">Experience</h2>
                    <p className="text-gray-700 mb-4">{teacher.experience}</p>
                    
                    <h2 className="font-semibold mb-2">Education</h2>
                    <ul className="list-disc list-inside text-gray-700">
                      {teacher.education.map((edu, index) => (
                        <li key={index}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Main Content Column */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">About {teacher.name}</h2>
                  <p className="text-gray-700 mb-6">{teacher.description}</p>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="schedule" className="data-[state=active]:bg-torah-100 data-[state=active]:text-torah-700">
                        <Calendar className="h-4 w-4 mr-2" /> Schedule
                      </TabsTrigger>
                      <TabsTrigger value="reviews" className="data-[state=active]:bg-torah-100 data-[state=active]:text-torah-700">
                        Reviews
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="schedule" className="pt-4">
                      <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
                      <div>
                        {teacher.availableSlots.map(daySlot => (
                          <CalendarDay 
                            key={daySlot.day} 
                            day={daySlot.day} 
                            slots={daySlot.slots} 
                            onSelectSlot={handleSelectSlot}
                            selectedSlot={selectedSlot}
                          />
                        ))}
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: selectedSlot ? 1 : 0 }}
                        className="mt-6 p-4 bg-torah-50 rounded-lg border border-torah-200"
                        style={{ display: selectedSlot ? 'block' : 'none' }}
                      >
                        {selectedSlot && (
                          <>
                            <h4 className="font-medium mb-2">Selected Time:</h4>
                            <p className="mb-4">{selectedSlot.day} at {selectedSlot.time}</p>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                className="w-full bg-torah-500 hover:bg-torah-600"
                                onClick={handleBookLesson}
                              >
                                Book This Lesson
                              </Button>
                            </motion.div>
                            <p className="text-sm text-center mt-2 text-torah-600">
                              First lesson is free! You'll be able to schedule more after your trial.
                            </p>
                          </>
                        )}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="pt-4">
                      <h3 className="text-lg font-semibold mb-4">Student Reviews</h3>
                      <Reviews reviews={teacher.reviews} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <Button 
                className="w-full bg-torah-500 hover:bg-torah-600 py-6 text-lg"
                onClick={() => setActiveTab('schedule')}
              >
                Schedule Your Free Trial Lesson
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherProfile;
