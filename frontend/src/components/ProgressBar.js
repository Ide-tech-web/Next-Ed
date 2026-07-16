
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, color = 'bg-orange-accent', height = 'h-2' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`${height} ${color} rounded-full`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
