
import React from 'react';
import { Link } from 'react-router-dom';

const SOSPartner = () => {
  return (
    <div className="flex justify-center my-8">
      <Link 
        to="/sos-havrouta" 
        className="rounded-full border-2 border-red-400 p-10 text-center hover:bg-red-50 transition-colors"
      >
        <div className="text-red-500 font-semibold">
          <div>SOS</div>
          <div>Havrouta</div>
        </div>
      </Link>
    </div>
  );
};

export default SOSPartner;
