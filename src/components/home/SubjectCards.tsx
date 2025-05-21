
import React from 'react';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  title: string;
  teacherCount: number;
  icon: string;
  link: string;
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
  const subjects = [
    { title: "Torah (Tanakh)", teacherCount: 528, icon: "📜", link: "/subjects/tanakh" },
    { title: "Talmud", teacherCount: 341, icon: "📚", link: "/subjects/talmud" },
    { title: "Mishnah", teacherCount: 215, icon: "📖", link: "/subjects/mishnah" },
    { title: "Halakha", teacherCount: 302, icon: "⚖️", link: "/subjects/halakha" },
    { title: "Jewish Philosophy", teacherCount: 189, icon: "🔍", link: "/subjects/jewish-philosophy" },
    { title: "Jewish History", teacherCount: 167, icon: "🏛️", link: "/subjects/jewish-history" },
    { title: "Kabbalah", teacherCount: 126, icon: "✨", link: "/subjects/kabbalah" },
    { title: "Hebrew Language", teacherCount: 243, icon: "🔤", link: "/subjects/hebrew" },
    { title: "Jewish Ethics", teacherCount: 192, icon: "🤝", link: "/subjects/ethics" },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Find a teacher by subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard 
              key={index}
              title={subject.title}
              teacherCount={subject.teacherCount}
              icon={subject.icon}
              link={subject.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectCards;
