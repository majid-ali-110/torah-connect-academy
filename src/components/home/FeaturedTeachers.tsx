
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TeacherCardProps {
  name: string;
  title: string;
  rating: number;
  subjects: string[];
  languages: string[];
  imageUrl?: string;
  id: string;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ 
  name, title, rating, subjects, languages, imageUrl, id 
}) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-torah-500 flex items-center justify-center text-white font-bold text-xl mr-4">
              {initials}
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Teaches:</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {subjects.map((subject, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-torah-100 text-torah-800">
                {subject}
              </span>
            ))}
          </div>
          
          <div className="text-sm font-medium text-gray-700 mb-1">Speaks:</div>
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">First lesson</p>
            <p className="font-bold text-torah-600">Free</p>
          </div>
          <Button asChild className="bg-torah-500 hover:bg-torah-600">
            <Link to={`/teacher/${id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeaturedTeachers = () => {
  const teachers = [
    {
      id: "rabbi-david-cohen",
      name: "Rabbi David Cohen",
      title: "Talmud & Halakha Expert",
      rating: 4.9,
      subjects: ["Talmud", "Halakha", "Jewish Law"],
      languages: ["English", "Hebrew", "Yiddish"],
    },
    {
      id: "sarah-goldstein",
      name: "Sarah Goldstein",
      title: "Tanakh & Hebrew Teacher",
      rating: 4.8,
      subjects: ["Tanakh", "Hebrew", "Jewish History"],
      languages: ["English", "Hebrew"],
    },
    {
      id: "rabbi-moshe-levy",
      name: "Rabbi Moshe Levy",
      title: "Mishnah & Ethics Specialist",
      rating: 5.0,
      subjects: ["Mishnah", "Ethics", "Philosophy"],
      languages: ["English", "Hebrew", "French"],
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold">Featured teachers</h2>
          <Link to="/find-teachers" className="text-torah-600 hover:text-torah-700 font-medium flex items-center">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} {...teacher} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-torah-500 hover:bg-torah-600 text-white font-semibold px-6 py-3 rounded-md">
            <Link to="/find-teachers">Browse All Teachers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTeachers;
