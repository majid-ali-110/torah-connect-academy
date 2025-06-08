
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SubjectCardProps {
  title: string;
  teacherCount: number;
  icon: string;
  link: string;
}

interface SubjectData {
  name: string;
  teacherCount: number;
  icon: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, teacherCount, icon, link }) => {
  return (
    <Link 
      to={link} 
      className="flex items-center justify-between p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white group"
    >
      <div className="flex items-center">
        <div className="text-2xl mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg group-hover:text-torah-600 transition-colors">{title}</h3>
          <p className="text-gray-500">{teacherCount} teachers</p>
        </div>
      </div>
      <div className="text-gray-400 group-hover:text-torah-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

const SubjectCards = () => {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectsWithTeacherCounts();
  }, []);

  const fetchSubjectsWithTeacherCounts = async () => {
    try {
      // Fetch all profiles with teacher role
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('subjects')
        .eq('role', 'teacher')
        .not('subjects', 'is', null);

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        setLoading(false);
        return;
      }

      // Count teachers by subject
      const subjectCounts: { [key: string]: number } = {};
      
      teachers?.forEach(teacher => {
        if (teacher.subjects && Array.isArray(teacher.subjects)) {
          teacher.subjects.forEach(subject => {
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
          });
        }
      });

      // Map subjects to their display data with icons
      const subjectIconMap: { [key: string]: string } = {
        'Torah (Tanakh)': '📜',
        'Tanakh': '📜',
        'Talmud': '📚',
        'Mishnah': '📖',
        'Halakha': '⚖️',
        'Jewish Philosophy': '🔍',
        'Jewish History': '🏛️',
        'Kabbalah': '✨',
        'Hebrew Language': '🔤',
        'Hebrew': '🔤',
        'Jewish Ethics': '🤝',
        'Ethics': '🤝',
        'Chassidut': '✨',
        'Mussar': '💎',
        'Rashi': '📖',
        'Gemara': '📚'
      };

      // Convert to array and sort by teacher count
      const subjectsArray = Object.entries(subjectCounts)
        .map(([name, count]) => ({
          name,
          teacherCount: count,
          icon: subjectIconMap[name] || '📚'
        }))
        .sort((a, b) => b.teacherCount - a.teacherCount)
        .slice(0, 9); // Limit to top 9 subjects

      setSubjects(subjectsArray);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find a teacher by subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center justify-between p-6 border rounded-lg shadow-sm bg-white">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Find a teacher by subject</h2>
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard 
                key={index}
                title={subject.name}
                teacherCount={subject.teacherCount}
                icon={subject.icon}
                link={`/find-teachers?subject=${encodeURIComponent(subject.name)}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subjects with teachers available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCards;
