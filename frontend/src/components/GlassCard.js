
import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02 } : {}}
      className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
