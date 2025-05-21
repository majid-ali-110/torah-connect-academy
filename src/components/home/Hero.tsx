
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-torah-50">
      <div className="container mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 md:pr-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Torah with your perfect teacher
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Connect with expert Torah teachers for personalized online lessons in
            Tanakh, Mishnah, Halakha, and more. Start your journey today with a free
            trial lesson.
          </p>
          <Button asChild className="bg-torah-500 hover:bg-torah-600 text-white font-semibold px-8 py-6 text-lg rounded-md">
            <Link to="/find-teachers">Get started</Link>
          </Button>
        </div>
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-1 bg-torah-100">
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-torah-500 flex items-center justify-center text-white font-semibold">
                      RT
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Rabbi Tzvi</p>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">Tanakh & Talmud</span>
                        <span className="mx-1 text-sm text-gray-500">•</span>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700 ml-1">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Next available</p>
                    <p className="font-semibold">Today at 3:30 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">First lesson</p>
                    <p className="font-semibold text-torah-600">Free</p>
                  </div>
                </div>
                <Button className="w-full bg-torah-500 hover:bg-torah-600">Book Trial Lesson</Button>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 transform rotate-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-24 h-32 z-0">
            </div>
            <div className="absolute -left-4 -bottom-4 transform -rotate-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-20 h-28 z-0">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
