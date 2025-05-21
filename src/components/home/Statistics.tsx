
import React from 'react';

const Statistics = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900">1,000+</div>
            <p className="text-gray-600 mt-2">Qualified Torah teachers</p>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900">25,000+</div>
            <p className="text-gray-600 mt-2">5-star teacher reviews</p>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900">30+</div>
            <p className="text-gray-600 mt-2">Subjects taught</p>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900">12+</div>
            <p className="text-gray-600 mt-2">Teacher nationalities</p>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900">4.8★★★★★</div>
            <p className="text-gray-600 mt-2">on the App Store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
