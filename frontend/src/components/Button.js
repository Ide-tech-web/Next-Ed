
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-teal-primary to-teal-600 text-white hover:shadow-lg focus:ring-teal-500",
    secondary: "bg-gradient-to-r from-orange-accent to-orange-600 text-white hover:shadow-lg focus:ring-orange-500",
    outline: "border-2 border-teal-primary text-teal-primary hover:bg-teal-primary hover:text-white focus:ring-teal-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
