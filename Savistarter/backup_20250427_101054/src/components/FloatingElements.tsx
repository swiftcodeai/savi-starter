
import React from 'react';

interface FloatingElementProps {
  icon: React.ReactNode;
  className?: string;
}

const FloatingElement = ({ icon, className = "" }: FloatingElementProps) => {
  return (
    <div className={`absolute text-3xl sm:text-4xl opacity-70 ${className}`}>
      {icon}
    </div>
  );
};

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Books */}
      <FloatingElement 
        icon="📚" 
        className="top-[15%] left-[10%] animate-float"
      />
      <FloatingElement 
        icon="📘" 
        className="top-[25%] right-[15%] animate-float-reverse"
      />
      <FloatingElement 
        icon="📗" 
        className="bottom-[30%] left-[15%] animate-float"
      />

      {/* Pencils and school items */}
      <FloatingElement 
        icon="✏️" 
        className="top-[40%] right-[20%] animate-float-reverse"
      />
      <FloatingElement 
        icon="🖌️" 
        className="bottom-[20%] right-[25%] animate-float"
      />

      {/* Magnifying glass and stars */}
      <FloatingElement 
        icon="🔍" 
        className="top-[60%] left-[20%] animate-float-reverse"
      />
      <FloatingElement 
        icon="⭐" 
        className="top-[10%] right-[40%] animate-float"
      />
      <FloatingElement 
        icon="✨" 
        className="bottom-[15%] left-[40%] animate-float-reverse"
      />
      <FloatingElement 
        icon="🌟" 
        className="top-[70%] right-[10%] animate-float"
      />
    </div>
  );
};

export default FloatingElements;
