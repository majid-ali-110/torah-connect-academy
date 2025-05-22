
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SOSPartner = () => {
  return (
    <div className="flex justify-center my-12 py-8">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/sos-havrouta" 
          className="rounded-full border-2 border-red-400 w-40 h-40 flex flex-col items-center justify-center hover:bg-red-50 transition-all shadow-lg"
        >
          <div className="text-red-500 font-semibold text-center">
            <div className="text-2xl font-bold">SOS</div>
            <div className="text-xl">Havrouta</div>
            <div className="mt-2 text-sm">Find a partner now</div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default SOSPartner;
