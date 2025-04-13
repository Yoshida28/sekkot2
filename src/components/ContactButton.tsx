import React from 'react';
import { Mail } from 'lucide-react';

interface ContactButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

const ContactButton: React.FC<ContactButtonProps> = ({ 
  className = '', 
  variant = 'primary' 
}) => {
  const handleClick = () => {
    window.location.href = 'mailto:sekkot_engineering@yahoo.com';
  };

  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
  const variantStyles = variant === 'primary'
    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
    : "bg-gray-900 hover:bg-gray-800 text-purple-200 border border-purple-900 hover:border-purple-500";

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <Mail size={20} />
      <span>Contact Us</span>
    </button>
  );
};

export default ContactButton;