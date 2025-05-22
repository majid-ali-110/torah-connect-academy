
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SOSPartner = () => {
  return (
    <div className="flex justify-center my-12 py-8">
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        <Link 
          to="/sos-havrouta" 
          className="rounded-full border-2 border-red-400 w-40 h-40 flex flex-col items-center justify-center hover:bg-red-50 transition-all shadow-lg relative overflow-hidden group"
        >
          <div className="text-red-500 font-semibold text-center z-10">
            <div className="text-2xl font-bold group-hover:scale-110 transition-transform">SOS</div>
            <div className="text-xl group-hover:scale-110 transition-transform delay-75">Havrouta</div>
            <motion.div 
              className="mt-2 text-sm"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Find a partner now
            </motion.div>
          </div>
          
          {/* Ripple effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-red-100 rounded-full opacity-0 origin-center"
            whileHover={{ opacity: 0.6, scale: 1 }}
            initial={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          />
        </Link>
      </motion.div>
    </div>
  );
};

export default SOSPartner;
