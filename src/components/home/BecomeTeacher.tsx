
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BecomeTeacher = () => {
  return (
    <div className="bg-torah-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 flex items-center justify-center">
            <div className="relative w-full max-w-md h-96 rounded-lg overflow-hidden border-4 border-white shadow-lg">
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <svg className="h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-bold mb-6">Become a Torah teacher</h2>
            
            <p className="text-lg mb-8 text-gray-700">
              Share your knowledge and expertise in Torah studies with students around the world. Sign up to start teaching online with TorahConnect.
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-torah-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">Connect with students seeking Torah knowledge</span>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-torah-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">Build your teaching business and reputation</span>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-torah-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">Receive payments securely and reliably</span>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-torah-500 hover:bg-torah-600 text-white font-semibold px-6 py-3 rounded-md">
                <Link to="/become-teacher">Become a Teacher</Link>
              </Button>
              
              <Button asChild variant="outline" className="border-torah-500 text-torah-600 hover:bg-torah-50 font-semibold px-6 py-3 rounded-md">
                <Link to="/how-it-works-teachers">How Our Platform Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeTeacher;
