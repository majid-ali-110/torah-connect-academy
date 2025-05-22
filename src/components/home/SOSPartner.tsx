
import React from 'react';
import { Link } from 'react-router-dom';

const SOSPartner = () => {
  return (
    <div className="flex justify-center my-12">
      <Link 
        to="/sos-havrouta" 
        className="rounded-full border-2 border-red-400 w-32 h-32 flex flex-col items-center justify-center hover:bg-red-50 transition-colors"
      >
        <div className="text-red-500 font-semibold text-center">
          <div>SOS</div>
          <div>Havrouta</div>
        </div>
      </Link>
    </div>
  );
};

export default SOSPartner;
